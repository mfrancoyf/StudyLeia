package com.memora.gamification.service;

import com.memora.gamification.entity.Achievement;
import com.memora.gamification.entity.TipoConquista;
import com.memora.gamification.entity.UserProgress;
import com.memora.gamification.repository.AchievementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Verifica e concede conquistas (badges) com base no progresso atual
 * do usuário. Chamado pelo GamificationService após qualquer
 * atividade que possa ter cruzado um marco (XP, questões respondidas,
 * planos concluídos, etc).
 *
 * Cada conquista só é concedida uma vez (ver constraint única na
 * entidade Achievement), então é seguro chamar este método com
 * frequência sem se preocupar em duplicar badges.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AchievementService {

    private final AchievementRepository achievementRepository;

    @Transactional
    public List<TipoConquista> verificarEConcederConquistas(UserProgress progresso, int sequenciaAtualStreak) {
        List<TipoConquista> novasConquistas = new ArrayList<>();
        UUID usuarioId = progresso.getUsuario().getId();

        conceder(progresso.getUsuario(), TipoConquista.PRIMEIRA_PROVA,
                progresso.getTotalQuizzesRespondidos() >= 1, novasConquistas);

        conceder(progresso.getUsuario(), TipoConquista.CEM_QUESTOES_RESPONDIDAS,
                progresso.getTotalQuestoesCorretas() >= 100, novasConquistas);

        conceder(progresso.getUsuario(), TipoConquista.MIL_XP,
                progresso.getXpTotal() >= 1000, novasConquistas);

        conceder(progresso.getUsuario(), TipoConquista.CINCO_MIL_XP,
                progresso.getXpTotal() >= 5000, novasConquistas);

        conceder(progresso.getUsuario(), TipoConquista.PRIMEIRA_ANOTACAO,
                progresso.getTotalAnotacoesCriadas() >= 1, novasConquistas);

        conceder(progresso.getUsuario(), TipoConquista.PRIMEIRO_PLANO_CONCLUIDO,
                progresso.getTotalPlanosConcluidos() >= 1, novasConquistas);

        conceder(progresso.getUsuario(), TipoConquista.NIVEL_10,
                progresso.getNivelAtual() >= 10, novasConquistas);

        conceder(progresso.getUsuario(), TipoConquista.NIVEL_20,
                progresso.getNivelAtual() >= 20, novasConquistas);

        conceder(progresso.getUsuario(), TipoConquista.NIVEL_30,
                progresso.getNivelAtual() >= 30, novasConquistas);

        conceder(progresso.getUsuario(), TipoConquista.SEQUENCIA_7_DIAS,
                sequenciaAtualStreak >= 7, novasConquistas);

        conceder(progresso.getUsuario(), TipoConquista.SEQUENCIA_30_DIAS,
                sequenciaAtualStreak >= 30, novasConquistas);

        if (!novasConquistas.isEmpty()) {
            log.info("Usuário {} desbloqueou {} nova(s) conquista(s): {}", usuarioId, novasConquistas.size(), novasConquistas);
        }

        return novasConquistas;
    }

    @Transactional(readOnly = true)
    public List<Achievement> listarConquistas(UUID usuarioId) {
        return achievementRepository.findByUsuarioIdOrderByDesbloqueadaEmDesc(usuarioId);
    }

    private void conceder(com.memora.auth.entity.Usuario usuario, TipoConquista tipo, boolean condicaoSatisfeita, List<TipoConquista> acumulador) {
        if (!condicaoSatisfeita) {
            return;
        }
        if (achievementRepository.existsByUsuarioIdAndTipo(usuario.getId(), tipo)) {
            return;
        }
        Achievement achievement = Achievement.builder()
                .usuario(usuario)
                .tipo(tipo)
                .build();
        achievementRepository.save(achievement);
        acumulador.add(tipo);
    }
}
