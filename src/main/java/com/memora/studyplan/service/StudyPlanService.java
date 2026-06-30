package com.memora.studyplan.service;

import com.memora.auth.entity.Usuario;
import com.memora.dailymission.entity.TipoMissaoDiaria;
import com.memora.dailymission.service.DailyMissionService;
import com.memora.exception.AcessoNegadoException;
import com.memora.exception.RecursoNaoEncontradoException;
import com.memora.gamification.entity.TipoAtividade;
import com.memora.gamification.service.GamificationService;
import com.memora.integration.ai.dto.PlanoEstudosGerado;
import com.memora.integration.ai.service.AIStudyPlanGeneratorService;
import com.memora.studyplan.dto.GerarPlanoEstudosRequest;
import com.memora.studyplan.dto.StudyPlanResponse;
import com.memora.studyplan.dto.StudyPlanResumoResponse;
import com.memora.studyplan.entity.StudyPlan;
import com.memora.studyplan.entity.StudyPlanItem;
import com.memora.studyplan.entity.TipoItemCronograma;
import com.memora.studyplan.repository.StudyPlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudyPlanService {

    private final StudyPlanRepository studyPlanRepository;
    private final GamificationService gamificationService;
    private final AIStudyPlanGeneratorService aiStudyPlanGeneratorService;
    private final DailyMissionService dailyMissionService;

    @Transactional(readOnly = true)
    public List<StudyPlanResumoResponse> listarPorUsuario(UUID usuarioId) {
        return studyPlanRepository.findByUsuarioIdOrderByDataProvaAsc(usuarioId)
                .stream().map(this::toResumoResponse).toList();
    }

    @Transactional(readOnly = true)
    public StudyPlanResponse buscarPorId(UUID id, UUID usuarioId) {
        StudyPlan plan = buscarComItensEValidarPropriedade(id, usuarioId);
        return toResponse(plan);
    }

    /**
     * Gera um plano de estudos completo via IA (cronograma, divisão de
     * assuntos, revisões e simulados) e já persiste tudo no banco —
     * a usuária não precisa montar nada manualmente.
     */
    @Transactional
    public StudyPlanResponse gerarComIA(Usuario usuario, GerarPlanoEstudosRequest request) {
        PlanoEstudosGerado planoGerado = aiStudyPlanGeneratorService.gerarPlano(
                request.materia(), request.dataProva(), request.horasDisponiveisPorDia());

        StudyPlan plan = StudyPlan.builder()
                .usuario(usuario)
                .materia(request.materia())
                .dataProva(request.dataProva())
                .horasDisponiveisPorDia(request.horasDisponiveisPorDia())
                .resumo(planoGerado.resumo())
                .concluido(false)
                .build();

        for (var itemGerado : planoGerado.itens()) {
            plan.adicionarItem(StudyPlanItem.builder()
                    .data(itemGerado.data())
                    .assunto(itemGerado.assunto())
                    .tipo(TipoItemCronograma.valueOf(itemGerado.tipo()))
                    .descricao(itemGerado.descricao())
                    .concluido(false)
                    .build());
        }

        plan = studyPlanRepository.save(plan);
        log.info("Plano de estudos para '{}' gerado via IA para o usuário {} ({} itens)",
                request.materia(), usuario.getId(), planoGerado.itens().size());

        return toResponse(plan);
    }

    @Transactional
    public StudyPlanResponse marcarItemConcluido(UUID planId, UUID itemId, UUID usuarioId) {
        StudyPlan plan = buscarComItensEValidarPropriedade(planId, usuarioId);

        StudyPlanItem item = plan.getItens().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RecursoNaoEncontradoException("Item do cronograma não encontrado."));

        item.setConcluido(true);
        dailyMissionService.incrementarProgresso(plan.getUsuario(), TipoMissaoDiaria.COMPLETAR_PLANO_DO_DIA, 1);

        boolean todosConcluidos = plan.getItens().stream().allMatch(StudyPlanItem::isConcluido);
        if (todosConcluidos && !plan.isConcluido()) {
            plan.setConcluido(true);
            gamificationService.concederRecompensa(plan.getUsuario(), TipoAtividade.PLANO_ESTUDOS_CONCLUIDO);
            log.info("Plano de estudos '{}' concluído pelo usuário {}", plan.getMateria(), usuarioId);
        }

        plan = studyPlanRepository.save(plan);
        return toResponse(plan);
    }

    @Transactional
    public void excluir(UUID id, UUID usuarioId) {
        StudyPlan plan = buscarEValidarPropriedade(id, usuarioId);
        studyPlanRepository.delete(plan);
    }

    private StudyPlan buscarComItensEValidarPropriedade(UUID id, UUID usuarioId) {
        StudyPlan plan = studyPlanRepository.buscarComItens(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Plano de estudos não encontrado."));
        if (!plan.getUsuario().getId().equals(usuarioId)) {
            throw new AcessoNegadoException("Este plano de estudos não pertence ao usuário autenticado.");
        }
        return plan;
    }

    private StudyPlan buscarEValidarPropriedade(UUID id, UUID usuarioId) {
        StudyPlan plan = studyPlanRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Plano de estudos não encontrado."));
        if (!plan.getUsuario().getId().equals(usuarioId)) {
            throw new AcessoNegadoException("Este plano de estudos não pertence ao usuário autenticado.");
        }
        return plan;
    }

    // ===================== Mapeamento entidade → DTO =====================
    // Feito manualmente (sem MapStruct) porque o alvo é um record com
    // um record aninhado (ItemResponse) — esse combinado é
    // historicamente frágil na geração de código do MapStruct. Mapear
    // na mão aqui elimina esse risco por completo, sem mudar nenhum
    // contrato de API.

    private StudyPlanResponse toResponse(StudyPlan plan) {
        return new StudyPlanResponse(
                plan.getId(),
                plan.getMateria(),
                plan.getDataProva(),
                plan.getHorasDisponiveisPorDia(),
                plan.getResumo(),
                plan.isConcluido(),
                calcularPercentual(plan.getItens()),
                mapearItensOrdenados(plan.getItens())
        );
    }

    private StudyPlanResumoResponse toResumoResponse(StudyPlan plan) {
        return new StudyPlanResumoResponse(
                plan.getId(),
                plan.getMateria(),
                plan.getDataProva(),
                plan.isConcluido(),
                calcularPercentual(plan.getItens()),
                plan.getItens().size()
        );
    }

    private List<StudyPlanResponse.ItemResponse> mapearItensOrdenados(List<StudyPlanItem> itens) {
        return itens.stream()
                .sorted(Comparator.comparing(StudyPlanItem::getData))
                .map(i -> new StudyPlanResponse.ItemResponse(
                        i.getId(), i.getData(), i.getAssunto(), i.getTipo().name(), i.getDescricao(), i.isConcluido()
                ))
                .toList();
    }

    private double calcularPercentual(List<StudyPlanItem> itens) {
        if (itens.isEmpty()) {
            return 0.0;
        }
        long concluidos = itens.stream().filter(StudyPlanItem::isConcluido).count();
        return (concluidos * 100.0) / itens.size();
    }
}
