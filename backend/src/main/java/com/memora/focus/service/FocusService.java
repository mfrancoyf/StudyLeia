package com.memora.focus.service;

import com.memora.auth.entity.Usuario;
import com.memora.dailymission.entity.TipoMissaoDiaria;
import com.memora.dailymission.service.DailyMissionService;
import com.memora.focus.dto.ConcluirSessaoFocoRequest;
import com.memora.focus.dto.SessaoFocoResultado;
import com.memora.focus.entity.FocusSession;
import com.memora.focus.entity.TipoSessaoFoco;
import com.memora.focus.repository.FocusSessionRepository;
import com.memora.gamification.entity.TipoAtividade;
import com.memora.gamification.service.GamificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * O timer do Pomodoro (25 min de foco / 5 min de pausa) roda no
 * frontend via JavaScript puro. Este Service apenas registra cada
 * sessão concluída e concede a recompensa correspondente — apenas
 * sessões do tipo FOCO geram XP (pausas não geram, são só um
 * descanso merecido).
 */
@Service
@RequiredArgsConstructor
public class FocusService {

    private final FocusSessionRepository focusSessionRepository;
    private final GamificationService gamificationService;
    private final DailyMissionService dailyMissionService;

    @Transactional
    public SessaoFocoResultado concluirSessao(Usuario usuario, ConcluirSessaoFocoRequest request) {
        FocusSession sessao = FocusSession.builder()
                .usuario(usuario)
                .tipo(request.tipo())
                .duracaoMinutos(request.duracaoMinutos())
                .build();
        focusSessionRepository.save(sessao);

        boolean concedeuXp = request.tipo() == TipoSessaoFoco.FOCO;
        var recompensa = concedeuXp
                ? gamificationService.concederRecompensa(usuario, TipoAtividade.SESSAO_FOCO_CONCLUIDA)
                : null;

        if (concedeuXp) {
            dailyMissionService.incrementarProgresso(usuario, TipoMissaoDiaria.ESTUDAR_30_MINUTOS, request.duracaoMinutos());
        }

        long totalMinutosHoje = somarMinutosFocoHoje(usuario.getId());

        return new SessaoFocoResultado(concedeuXp, totalMinutosHoje, recompensa);
    }

    @Transactional(readOnly = true)
    public long somarMinutosFocoHoje(java.util.UUID usuarioId) {
        LocalDate hoje = LocalDate.now();
        LocalDateTime inicio = hoje.atStartOfDay();
        LocalDateTime fim = hoje.plusDays(1).atStartOfDay();

        List<FocusSession> sessoes = focusSessionRepository.findByUsuarioIdAndConcluidaEmBetween(usuarioId, inicio, fim);
        return sessoes.stream()
                .filter(s -> s.getTipo() == TipoSessaoFoco.FOCO)
                .mapToLong(FocusSession::getDuracaoMinutos)
                .sum();
    }
}
