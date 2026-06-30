package com.memora.gamification.service;

import com.memora.auth.entity.Usuario;
import com.memora.gamification.entity.Streak;
import com.memora.gamification.entity.TipoAtividade;
import com.memora.gamification.entity.UserProgress;
import com.memora.gamification.repository.UserProgressRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("GamificationService — XP, nível, moedas e orquestração de recompensas")
class GamificationServiceTest {

    @Mock private UserProgressRepository userProgressRepository;
    @Mock private com.memora.pet.service.PetService petService;
    @Mock private StreakService streakService;
    @Mock private AchievementService achievementService;
    @Mock private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private GamificationService gamificationService;

    private Usuario usuario;
    private UserProgress progresso;

    @BeforeEach
    void configurar() {
        usuario = Usuario.builder().id(UUID.randomUUID()).nome("Ana Laura").build();
        progresso = UserProgress.builder()
                .usuario(usuario)
                .xpTotal(0)
                .nivelAtual(1)
                .moedas(0)
                .build();

        when(userProgressRepository.findByUsuarioId(usuario.getId())).thenReturn(Optional.of(progresso));
        when(userProgressRepository.save(any(UserProgress.class))).thenAnswer(inv -> inv.getArgument(0));

        Streak streakFake = Streak.builder().usuario(usuario).sequenciaAtual(1).maiorSequencia(1).build();
        when(streakService.registrarAtividadeHoje(usuario.getId())).thenReturn(streakFake);
    }

    @Test
    @DisplayName("Conceder recompensa de quiz correto soma XP e moedas conforme TipoAtividade")
    void concederRecompensaSomaXpEMoedas() {
        when(petService.atualizarEstagioEvolucao(eq(usuario.getId()), anyInt())).thenReturn(false);

        var resultado = gamificationService.concederRecompensa(usuario, TipoAtividade.QUIZ_RESPOSTA_CORRETA);

        assertThat(resultado.xpGanho()).isEqualTo(TipoAtividade.QUIZ_RESPOSTA_CORRETA.getXp());
        assertThat(resultado.moedasGanhas()).isEqualTo(TipoAtividade.QUIZ_RESPOSTA_CORRETA.getMoedas());
        assertThat(progresso.getXpTotal()).isEqualTo(TipoAtividade.QUIZ_RESPOSTA_CORRETA.getXp());
        assertThat(progresso.getMoedas()).isEqualTo(TipoAtividade.QUIZ_RESPOSTA_CORRETA.getMoedas());
    }

    @Test
    @DisplayName("Conceder recompensa que cruza o limiar de XP do nível 2 marca subiuDeNivel=true")
    void concederRecompensaQueCruzaLimiarSobeDeNivel() {
        progresso.setXpTotal(45); // faltam 5 XP para o nível 2 (limiar = 50)
        when(petService.atualizarEstagioEvolucao(eq(usuario.getId()), anyInt())).thenReturn(false);

        var resultado = gamificationService.concederRecompensa(usuario, TipoAtividade.QUIZ_RESPOSTA_CORRETA); // +10 XP

        assertThat(resultado.subiuDeNivel()).isTrue();
        assertThat(resultado.nivelAnterior()).isEqualTo(1);
        assertThat(resultado.nivelAtual()).isEqualTo(2);
    }

    @Test
    @DisplayName("Conceder recompensa sem cruzar limiar de nível mantém subiuDeNivel=false")
    void concederRecompensaSemCruzarLimiarNaoSobeDeNivel() {
        when(petService.atualizarEstagioEvolucao(eq(usuario.getId()), anyInt())).thenReturn(false);

        var resultado = gamificationService.concederRecompensa(usuario, TipoAtividade.ANOTACAO_CRIADA); // +5 XP, longe do limiar

        assertThat(resultado.subiuDeNivel()).isFalse();
        assertThat(resultado.nivelAtual()).isEqualTo(1);
    }

    @Test
    @DisplayName("Resposta errada de quiz NÃO chama reagirAGanhoDeXp (Leia não comemora erro)")
    void respostaErradaNaoComemoraNaLeia() {
        when(petService.atualizarEstagioEvolucao(eq(usuario.getId()), anyInt())).thenReturn(false);

        gamificationService.concederRecompensa(usuario, TipoAtividade.QUIZ_RESPOSTA_ERRADA);

        verify(petService, never()).reagirAGanhoDeXp(usuario.getId());
    }

    @Test
    @DisplayName("Resposta correta de quiz CHAMA reagirAGanhoDeXp")
    void respostaCorretaComemoraNaLeia() {
        when(petService.atualizarEstagioEvolucao(eq(usuario.getId()), anyInt())).thenReturn(false);

        gamificationService.concederRecompensa(usuario, TipoAtividade.QUIZ_RESPOSTA_CORRETA);

        verify(petService).reagirAGanhoDeXp(usuario.getId());
    }

    @Test
    @DisplayName("Quando a Leia evolui de estágio, o novoEstagioEvolucao é preenchido na resposta")
    void quandoLeiaEvoluiNovoEstagioEPreenchido() {
        when(petService.atualizarEstagioEvolucao(eq(usuario.getId()), anyInt())).thenReturn(true);

        var petStatusFake = com.memora.pet.entity.PetStatus.builder()
                .usuario(usuario)
                .estagioEvolucao(com.memora.pet.entity.EstagioEvolucao.JOVEM)
                .build();
        when(petService.buscarPorUsuario(usuario.getId())).thenReturn(petStatusFake);

        var resultado = gamificationService.concederRecompensa(usuario, TipoAtividade.QUIZ_RESPOSTA_CORRETA);

        assertThat(resultado.leiaEvoluiu()).isTrue();
        assertThat(resultado.novoEstagioEvolucao()).isEqualTo("JOVEM");
    }

    @Test
    @DisplayName("debitarMoedas reduz o saldo quando há moedas suficientes")
    void debitarMoedasComSaldoSuficiente() {
        progresso.setMoedas(100);

        gamificationService.debitarMoedas(usuario, 40);

        assertThat(progresso.getMoedas()).isEqualTo(60);
    }

    @Test
    @DisplayName("debitarMoedas lança MoedasInsuficientesException quando o saldo é menor que o valor solicitado")
    void debitarMoedasSemSaldoLancaExcecao() {
        progresso.setMoedas(10);

        org.assertj.core.api.Assertions.assertThatThrownBy(() -> gamificationService.debitarMoedas(usuario, 50))
                .isInstanceOf(com.memora.exception.MoedasInsuficientesException.class);

        assertThat(progresso.getMoedas()).isEqualTo(10); // saldo não deve ter sido alterado
    }

    @Test
    @DisplayName("registrarErroQuiz soma o XP mínimo de consolo e reage com humor neutro na Leia")
    void registrarErroQuizSomaXpMinimoEReageNaLeia() {
        gamificationService.registrarErroQuiz(usuario);

        assertThat(progresso.getXpTotal()).isEqualTo(TipoAtividade.QUIZ_RESPOSTA_ERRADA.getXp());
        verify(petService).reagirAErro(usuario.getId());
    }
}
