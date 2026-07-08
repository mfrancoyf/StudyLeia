package com.memora.gamification.service;

import com.memora.auth.entity.Usuario;
import com.memora.exception.RecursoNaoEncontradoException;
import com.memora.gamification.entity.Streak;
import com.memora.gamification.repository.StreakRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Controla a "sequência de estudos" (streak), inspirado diretamente
 * no mecanismo de ofensiva do Duolingo: estudar todo santo dia
 * incrementa a sequência; pular um dia inteiro zera ela.
 */
@Service
@RequiredArgsConstructor
public class StreakService {

    private final StreakRepository streakRepository;

    @Transactional
    public Streak criarParaUsuario(Usuario usuario) {
        Streak streak = Streak.builder()
                .usuario(usuario)
                .sequenciaAtual(0)
                .maiorSequencia(0)
                .build();
        return streakRepository.save(streak);
    }

    @Transactional(readOnly = true)
    public Streak buscarPorUsuario(UUID usuarioId) {
        return streakRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Streak não encontrado para este usuário."));
    }

    /**
     * Registra atividade de estudo "hoje". Se o último dia estudado
     * foi ontem, incrementa a sequência. Se foi hoje mesmo, não faz
     * nada (já contabilizado). Se foi antes de ontem, a sequência
     * quebrou e reinicia em 1.
     */
    @Transactional
    public Streak registrarAtividadeHoje(UUID usuarioId) {
        Streak streak = buscarPorUsuario(usuarioId);
        LocalDate hoje = LocalDate.now();

        if (streak.getUltimoDiaEstudado() == null) {
            streak.setSequenciaAtual(1);
        } else if (streak.getUltimoDiaEstudado().equals(hoje)) {
            return streak; // já contabilizado hoje, nada a fazer
        } else if (streak.getUltimoDiaEstudado().equals(hoje.minusDays(1))) {
            streak.setSequenciaAtual(streak.getSequenciaAtual() + 1);
        } else {
            streak.setSequenciaAtual(1); // sequência quebrada, reinicia
        }

        streak.setUltimoDiaEstudado(hoje);
        if (streak.getSequenciaAtual() > streak.getMaiorSequencia()) {
            streak.setMaiorSequencia(streak.getSequenciaAtual());
        }

        return streakRepository.save(streak);
    }

    /**
     * Chamado pela tarefa agendada diária: zera a sequência de quem
     * não estudou ontem nem hoje (ou seja, deixou passar um dia
     * inteiro em branco).
     */
    @Transactional
    public void quebrarSequenciaSeInativo(Streak streak) {
        LocalDate hoje = LocalDate.now();
        if (streak.getUltimoDiaEstudado() == null) {
            return;
        }
        boolean inativoOntemEHoje = streak.getUltimoDiaEstudado().isBefore(hoje.minusDays(1));
        if (inativoOntemEHoje && streak.getSequenciaAtual() > 0) {
            streak.setSequenciaAtual(0);
            streakRepository.save(streak);
        }
    }
}
