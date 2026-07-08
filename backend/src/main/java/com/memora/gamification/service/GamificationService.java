package com.memora.gamification.service;

import com.memora.auth.entity.Usuario;
import com.memora.exception.RecursoNaoEncontradoException;
import com.memora.gamification.dto.ProgressoResponse;
import com.memora.gamification.dto.RecompensaResponse;
import com.memora.gamification.entity.TipoAtividade;
import com.memora.gamification.entity.UserProgress;
import com.memora.gamification.event.RecompensaConcedidaEvent;
import com.memora.gamification.repository.UserProgressRepository;
import com.memora.gamification.util.CalculadoraNivel;
import com.memora.pet.service.PetService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Serviço central de gamificação: é aqui que toda atividade da
 * usuária se converte em XP, moedas, possível subida de nível,
 * evolução da Leia, atualização de streak e desbloqueio de
 * conquistas. Os demais módulos (quiz, notes, studyplan, focus) nunca
 * manipulam XP diretamente — eles apenas chamam
 * concederRecompensa(usuario, tipoAtividade).
 *
 * Essa centralização é o que garante que as regras de pontuação
 * fiquem consistentes e fáceis de ajustar em um único lugar.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GamificationService {

    private final UserProgressRepository userProgressRepository;
    private final PetService petService;
    private final StreakService streakService;
    private final AchievementService achievementService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public UserProgress criarParaUsuario(Usuario usuario) {
        UserProgress progresso = UserProgress.builder()
                .usuario(usuario)
                .xpTotal(0)
                .nivelAtual(1)
                .moedas(0)
                .build();
        return userProgressRepository.save(progresso);
    }

    @Transactional(readOnly = true)
    public UserProgress buscarPorUsuario(UUID usuarioId) {
        return userProgressRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Progresso não encontrado para este usuário."));
    }

    /**
     * Ponto de entrada único para conceder recompensa por uma
     * atividade. Atualiza XP/moedas/nível, reflete a reação emocional
     * na Leia, registra o dia no streak e verifica conquistas — tudo
     * em uma única transação atômica.
     */
    @Transactional
    public RecompensaResponse concederRecompensa(Usuario usuario, TipoAtividade tipoAtividade) {
        UserProgress progresso = buscarPorUsuario(usuario.getId());

        int nivelAnterior = progresso.getNivelAtual();

        progresso.setXpTotal(progresso.getXpTotal() + tipoAtividade.getXp());
        progresso.setMoedas(progresso.getMoedas() + tipoAtividade.getMoedas());

        atualizarContadoresEspecificos(progresso, tipoAtividade);

        int novoNivel = CalculadoraNivel.calcularNivel(progresso.getXpTotal());
        progresso.setNivelAtual(novoNivel);
        userProgressRepository.save(progresso);

        boolean subiuDeNivel = novoNivel > nivelAnterior;

        boolean leiaEvoluiu = petService.atualizarEstagioEvolucao(usuario.getId(), novoNivel);
        if (tipoAtividade != TipoAtividade.QUIZ_RESPOSTA_ERRADA) {
            petService.reagirAGanhoDeXp(usuario.getId());
        }

        var streak = streakService.registrarAtividadeHoje(usuario.getId());
        achievementService.verificarEConcederConquistas(progresso, streak.getSequenciaAtual());

        if (subiuDeNivel) {
            log.info("Usuário {} subiu para o nível {}", usuario.getId(), novoNivel);
        }

        String novoEstagio = leiaEvoluiu
                ? petService.buscarPorUsuario(usuario.getId()).getEstagioEvolucao().name()
                : null;

        eventPublisher.publishEvent(new RecompensaConcedidaEvent(usuario.getId()));

        return new RecompensaResponse(
                tipoAtividade.getXp(),
                tipoAtividade.getMoedas(),
                progresso.getXpTotal(),
                nivelAnterior,
                novoNivel,
                subiuDeNivel,
                leiaEvoluiu,
                novoEstagio
        );
    }

    /**
     * Registra um erro de quiz: não soma XP de erro praticamente
     * nenhum (apenas o consolo mínimo definido em
     * TipoAtividade.QUIZ_RESPOSTA_ERRADA), mas ainda assim reage com a
     * Leia ficando um pouco menos animada, para reforçar o feedback
     * sem desmotivar.
     */
    @Transactional
    public void registrarErroQuiz(Usuario usuario) {
        UserProgress progresso = buscarPorUsuario(usuario.getId());
        progresso.setXpTotal(progresso.getXpTotal() + TipoAtividade.QUIZ_RESPOSTA_ERRADA.getXp());
        userProgressRepository.save(progresso);
        petService.reagirAErro(usuario.getId());
    }

    @Transactional(readOnly = true)
    public ProgressoResponse obterProgressoCompleto(UUID usuarioId) {
        UserProgress progresso = buscarPorUsuario(usuarioId);
        var streak = streakService.buscarPorUsuario(usuarioId);
        List<String> conquistas = achievementService.listarConquistas(usuarioId)
                .stream().map(a -> a.getTipo().name()).toList();

        return new ProgressoResponse(
                progresso.getXpTotal(),
                progresso.getNivelAtual(),
                CalculadoraNivel.xpFaltanteParaProximoNivel(progresso.getXpTotal()),
                CalculadoraNivel.progressoPercentualNivelAtual(progresso.getXpTotal()),
                progresso.getMoedas(),
                streak.getSequenciaAtual(),
                streak.getMaiorSequencia(),
                conquistas
        );
    }

    /**
     * Debita moedas do saldo do usuário — usado pelo ShopService ao
     * concluir uma compra. Lança MoedasInsuficientesException se o
     * saldo atual for menor que o valor solicitado, evitando saldo
     * negativo.
     */
    @Transactional
    public void debitarMoedas(Usuario usuario, long quantidade) {
        UserProgress progresso = buscarPorUsuario(usuario.getId());
        if (progresso.getMoedas() < quantidade) {
            throw new com.memora.exception.MoedasInsuficientesException(
                    "Moedas insuficientes para concluir esta compra.");
        }
        progresso.setMoedas(progresso.getMoedas() - quantidade);
        userProgressRepository.save(progresso);
    }

    /**
     * Registra sementes ganhas pelo Jardim — XP indireto que não
     * passa por concederRecompensa porque não é uma "atividade" com
     * tipo fixo, e sim um subproduto contínuo do estudo (chamado pelo
     * GardenService a cada recompensa de gamificação concedida).
     */
    @Transactional(readOnly = true)
    public long saldoDeMoedas(UUID usuarioId) {
        return buscarPorUsuario(usuarioId).getMoedas();
    }

    private void atualizarContadoresEspecificos(UserProgress progresso, TipoAtividade tipo) {
        switch (tipo) {
            case QUIZ_RESPOSTA_CORRETA -> progresso.setTotalQuestoesCorretas(progresso.getTotalQuestoesCorretas() + 1);
            case QUIZ_COMPLETO -> progresso.setTotalQuizzesRespondidos(progresso.getTotalQuizzesRespondidos() + 1);
            case ANOTACAO_CRIADA -> progresso.setTotalAnotacoesCriadas(progresso.getTotalAnotacoesCriadas() + 1);
            case PLANO_ESTUDOS_CONCLUIDO -> progresso.setTotalPlanosConcluidos(progresso.getTotalPlanosConcluidos() + 1);
            case SESSAO_FOCO_CONCLUIDA -> progresso.setTotalMinutosFoco(progresso.getTotalMinutosFoco() + 25);
            default -> { /* sem contador específico adicional */ }
        }
    }
}
