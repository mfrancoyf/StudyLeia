package com.memora.dailymission.service;

import com.memora.auth.entity.Usuario;
import com.memora.dailymission.dto.DailyMissionResponse;
import com.memora.dailymission.entity.DailyMission;
import com.memora.dailymission.entity.TipoMissaoDiaria;
import com.memora.dailymission.repository.DailyMissionRepository;
import com.memora.gamification.entity.TipoAtividade;
import com.memora.gamification.service.GamificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Gerencia o ciclo de vida das missões diárias: geração das missões
 * do dia (criadas de forma "lazy" — na primeira vez que a usuária
 * acessa a plataforma naquele dia, em vez de exigir um job à
 * meia-noite) e atualização de progresso conforme ela usa outras
 * partes do sistema (quiz, notes, focus, studyplan).
 *
 * Os demais Services (QuizService, NoteService, FocusSessionService,
 * StudyPlanService) chamam incrementarProgresso(...) depois de
 * concederem a própria recompensa de gamificação — a missão diária é
 * uma camada extra de recompensa por cima da atividade normal, não
 * uma substituta dela.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DailyMissionService {

    private final DailyMissionRepository dailyMissionRepository;
    private final GamificationService gamificationService;

    @Transactional
    public List<DailyMissionResponse> obterMissoesDoDia(Usuario usuario) {
        LocalDate hoje = LocalDate.now();

        if (!dailyMissionRepository.existsByUsuarioIdAndData(usuario.getId(), hoje)) {
            gerarMissoesDoDia(usuario, hoje);
        }

        return dailyMissionRepository.findByUsuarioIdAndData(usuario.getId(), hoje)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public void incrementarProgresso(Usuario usuario, TipoMissaoDiaria tipo, int quantidade) {
        LocalDate hoje = LocalDate.now();

        DailyMission missao = dailyMissionRepository.findByUsuarioIdAndDataAndTipo(usuario.getId(), hoje, tipo)
                .orElse(null);

        // Se a missão do dia ainda não foi gerada (ex.: a primeira
        // ação do dia foi direto um quiz, sem passar pelo dashboard),
        // criamos o conjunto completo agora.
        if (missao == null) {
            gerarMissoesDoDia(usuario, hoje);
            missao = dailyMissionRepository.findByUsuarioIdAndDataAndTipo(usuario.getId(), hoje, tipo).orElse(null);
            if (missao == null) {
                return;
            }
        }

        if (missao.isConcluida()) {
            return;
        }

        missao.setProgresso(Math.min(missao.getMeta(), missao.getProgresso() + quantidade));

        if (missao.getProgresso() >= missao.getMeta()) {
            missao.setConcluida(true);
            gamificationService.concederRecompensa(usuario, TipoAtividade.MISSAO_DIARIA_CONCLUIDA);
            log.info("Usuário {} concluiu a missão diária {}", usuario.getId(), tipo);
        }

        dailyMissionRepository.save(missao);
    }

    private void gerarMissoesDoDia(Usuario usuario, LocalDate data) {
        for (TipoMissaoDiaria tipo : TipoMissaoDiaria.values()) {
            boolean jaExiste = dailyMissionRepository.findByUsuarioIdAndDataAndTipo(usuario.getId(), data, tipo).isPresent();
            if (jaExiste) {
                continue;
            }
            DailyMission missao = DailyMission.builder()
                    .usuario(usuario)
                    .data(data)
                    .tipo(tipo)
                    .progresso(0)
                    .meta(tipo.getMetaPadrao())
                    .concluida(false)
                    .build();
            dailyMissionRepository.save(missao);
        }
    }

    private DailyMissionResponse toResponse(DailyMission missao) {
        return new DailyMissionResponse(
                missao.getId(),
                missao.getTipo().name(),
                tituloAmigavel(missao.getTipo()),
                missao.getProgresso(),
                missao.getMeta(),
                missao.isConcluida()
        );
    }

    private String tituloAmigavel(TipoMissaoDiaria tipo) {
        return switch (tipo) {
            case RESPONDER_10_QUESTOES -> "Responder 10 perguntas";
            case CRIAR_1_ANOTACAO -> "Criar 1 anotação";
            case ESTUDAR_30_MINUTOS -> "Estudar 30 minutos";
            case COMPLETAR_PLANO_DO_DIA -> "Completar o plano do dia";
        };
    }
}
