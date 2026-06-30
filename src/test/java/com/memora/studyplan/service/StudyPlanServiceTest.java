package com.memora.studyplan.service;

import com.memora.auth.entity.Usuario;
import com.memora.dailymission.service.DailyMissionService;
import com.memora.exception.AcessoNegadoException;
import com.memora.exception.RecursoNaoEncontradoException;
import com.memora.gamification.entity.TipoAtividade;
import com.memora.gamification.service.GamificationService;
import com.memora.integration.ai.dto.ItemCronogramaGerado;
import com.memora.integration.ai.dto.PlanoEstudosGerado;
import com.memora.integration.ai.service.AIStudyPlanGeneratorService;
import com.memora.studyplan.dto.GerarPlanoEstudosRequest;
import com.memora.studyplan.entity.StudyPlan;
import com.memora.studyplan.entity.StudyPlanItem;
import com.memora.studyplan.entity.TipoItemCronograma;
import com.memora.studyplan.repository.StudyPlanRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("StudyPlanService — geração via IA e conclusão de cronograma")
class StudyPlanServiceTest {

    @Mock private StudyPlanRepository studyPlanRepository;
    @Mock private GamificationService gamificationService;
    @Mock private AIStudyPlanGeneratorService aiStudyPlanGeneratorService;
    @Mock private DailyMissionService dailyMissionService;

    @InjectMocks
    private StudyPlanService studyPlanService;

    private Usuario usuario;

    @BeforeEach
    void configurar() {
        usuario = Usuario.builder().id(UUID.randomUUID()).nome("Ana Laura").build();
    }

    @Test
    @DisplayName("Gerar plano com IA persiste o plano com todos os itens retornados pelo provider")
    void gerarComIaPersisteTodosOsItens() {
        var request = new GerarPlanoEstudosRequest("Anatomia Humana", LocalDate.now().plusDays(10), 2.0);

        var itemGerado1 = new ItemCronogramaGerado(LocalDate.now(), "Anatomia — fundamentos", "ESTUDO", "desc 1");
        var itemGerado2 = new ItemCronogramaGerado(LocalDate.now().plusDays(1), "Anatomia", "REVISAO", "desc 2");
        var planoGerado = new PlanoEstudosGerado("Resumo do cronograma", List.of(itemGerado1, itemGerado2));

        when(aiStudyPlanGeneratorService.gerarPlano(eq("Anatomia Humana"), any(), eq(2.0))).thenReturn(planoGerado);
        when(studyPlanRepository.save(any(StudyPlan.class))).thenAnswer(inv -> inv.getArgument(0));

        var resposta = studyPlanService.gerarComIA(usuario, request);

        assertThat(resposta.materia()).isEqualTo("Anatomia Humana");
        assertThat(resposta.resumo()).isEqualTo("Resumo do cronograma");
        assertThat(resposta.itens()).hasSize(2);
        assertThat(resposta.itens().get(0).tipo()).isEqualTo("ESTUDO");
        assertThat(resposta.itens().get(1).tipo()).isEqualTo("REVISAO");

        verify(studyPlanRepository).save(argThat(plan -> plan.getItens().size() == 2
                && plan.getItens().get(0).getTipo() == TipoItemCronograma.ESTUDO
                && plan.getItens().get(1).getTipo() == TipoItemCronograma.REVISAO));
    }

    @Test
    @DisplayName("Marcar o último item pendente como concluído conclui o plano inteiro e concede XP")
    void marcarUltimoItemConcluiPlanoEConcedeXp() {
        StudyPlan plan = StudyPlan.builder().id(UUID.randomUUID()).usuario(usuario).materia("Química").concluido(false).build();

        StudyPlanItem itemJaConcluido = StudyPlanItem.builder().id(UUID.randomUUID()).studyPlan(plan).data(LocalDate.now()).concluido(true).build();
        StudyPlanItem itemPendente = StudyPlanItem.builder().id(UUID.randomUUID()).studyPlan(plan).data(LocalDate.now()).concluido(false).build();
        plan.setItens(new java.util.ArrayList<>(List.of(itemJaConcluido, itemPendente)));

        when(studyPlanRepository.buscarComItens(plan.getId())).thenReturn(Optional.of(plan));
        when(studyPlanRepository.save(any(StudyPlan.class))).thenAnswer(inv -> inv.getArgument(0));

        var resposta = studyPlanService.marcarItemConcluido(plan.getId(), itemPendente.getId(), usuario.getId());

        assertThat(itemPendente.isConcluido()).isTrue();
        assertThat(plan.isConcluido()).isTrue();
        assertThat(resposta.concluido()).isTrue();
        assertThat(resposta.percentualConcluido()).isEqualTo(100.0);

        verify(gamificationService).concederRecompensa(usuario, TipoAtividade.PLANO_ESTUDOS_CONCLUIDO);
    }

    @Test
    @DisplayName("Marcar um item concluído quando ainda há outros pendentes NÃO conclui o plano nem concede XP de conclusão")
    void marcarItemComOutrosPendentesNaoConcluiPlano() {
        StudyPlan plan = StudyPlan.builder().id(UUID.randomUUID()).usuario(usuario).materia("Física").concluido(false).build();

        StudyPlanItem itemAlvo = StudyPlanItem.builder().id(UUID.randomUUID()).studyPlan(plan).data(LocalDate.now()).concluido(false).build();
        StudyPlanItem outroPendente = StudyPlanItem.builder().id(UUID.randomUUID()).studyPlan(plan).data(LocalDate.now()).concluido(false).build();
        plan.setItens(new java.util.ArrayList<>(List.of(itemAlvo, outroPendente)));

        when(studyPlanRepository.buscarComItens(plan.getId())).thenReturn(Optional.of(plan));
        when(studyPlanRepository.save(any(StudyPlan.class))).thenAnswer(inv -> inv.getArgument(0));

        var resposta = studyPlanService.marcarItemConcluido(plan.getId(), itemAlvo.getId(), usuario.getId());

        assertThat(plan.isConcluido()).isFalse();
        assertThat(resposta.percentualConcluido()).isEqualTo(50.0);
        verify(gamificationService, never()).concederRecompensa(any(), eq(TipoAtividade.PLANO_ESTUDOS_CONCLUIDO));
    }

    @Test
    @DisplayName("Marcar item de um plano que já estava concluído não concede XP de novo (idempotência)")
    void marcarItemDePlanoJaConcluidoNaoConcedeXpDeNovo() {
        StudyPlan plan = StudyPlan.builder().id(UUID.randomUUID()).usuario(usuario).materia("Biologia").concluido(true).build();
        StudyPlanItem item = StudyPlanItem.builder().id(UUID.randomUUID()).studyPlan(plan).data(LocalDate.now()).concluido(false).build();
        plan.setItens(new java.util.ArrayList<>(List.of(item)));

        when(studyPlanRepository.buscarComItens(plan.getId())).thenReturn(Optional.of(plan));
        when(studyPlanRepository.save(any(StudyPlan.class))).thenAnswer(inv -> inv.getArgument(0));

        studyPlanService.marcarItemConcluido(plan.getId(), item.getId(), usuario.getId());

        verify(gamificationService, never()).concederRecompensa(any(), any());
    }

    @Test
    @DisplayName("Buscar plano de outro usuário lança AcessoNegadoException")
    void buscarPlanoDeOutroUsuarioLancaAcessoNegado() {
        UUID outroUsuarioId = UUID.randomUUID();
        Usuario donoReal = Usuario.builder().id(outroUsuarioId).build();
        StudyPlan plan = StudyPlan.builder().id(UUID.randomUUID()).usuario(donoReal).itens(List.of()).build();

        when(studyPlanRepository.buscarComItens(plan.getId())).thenReturn(Optional.of(plan));

        assertThatThrownBy(() -> studyPlanService.buscarPorId(plan.getId(), usuario.getId()))
                .isInstanceOf(AcessoNegadoException.class);
    }

    @Test
    @DisplayName("Buscar plano inexistente lança RecursoNaoEncontradoException")
    void buscarPlanoInexistenteLancaExcecao() {
        UUID idInexistente = UUID.randomUUID();
        when(studyPlanRepository.buscarComItens(idInexistente)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> studyPlanService.buscarPorId(idInexistente, usuario.getId()))
                .isInstanceOf(RecursoNaoEncontradoException.class);
    }

    @Test
    @DisplayName("Marcar item concluído incrementa a missão diária COMPLETAR_PLANO_DO_DIA")
    void marcarItemIncrementaMissaoDiaria() {
        StudyPlan plan = StudyPlan.builder().id(UUID.randomUUID()).usuario(usuario).materia("História").concluido(false).build();
        StudyPlanItem item1 = StudyPlanItem.builder().id(UUID.randomUUID()).studyPlan(plan).data(LocalDate.now()).concluido(false).build();
        StudyPlanItem item2 = StudyPlanItem.builder().id(UUID.randomUUID()).studyPlan(plan).data(LocalDate.now()).concluido(false).build();
        plan.setItens(new java.util.ArrayList<>(List.of(item1, item2)));

        when(studyPlanRepository.buscarComItens(plan.getId())).thenReturn(Optional.of(plan));
        when(studyPlanRepository.save(any(StudyPlan.class))).thenAnswer(inv -> inv.getArgument(0));

        studyPlanService.marcarItemConcluido(plan.getId(), item1.getId(), usuario.getId());

        verify(dailyMissionService).incrementarProgresso(usuario, com.memora.dailymission.entity.TipoMissaoDiaria.COMPLETAR_PLANO_DO_DIA, 1);
    }
}
