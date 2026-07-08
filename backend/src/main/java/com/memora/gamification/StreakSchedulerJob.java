package com.memora.gamification;

import com.memora.gamification.repository.StreakRepository;
import com.memora.gamification.service.StreakService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Roda logo após a virada do dia (00:05) e zera a sequência de
 * quem deixou passar um dia inteiro sem nenhuma atividade — antes
 * que ela mesma volte a estudar e o sistema precise decidir
 * silenciosamente se a sequência ainda vale.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class StreakSchedulerJob {

    private final StreakRepository streakRepository;
    private final StreakService streakService;

    @Scheduled(cron = "0 5 0 * * *")
    public void quebrarSequenciasInativas() {
        var todosOsStreaks = streakRepository.findAll();
        int processados = 0;

        for (var streak : todosOsStreaks) {
            streakService.quebrarSequenciaSeInativo(streak);
            processados++;
        }

        log.info("Job de verificação de streaks executado — {} streaks verificados.", processados);
    }
}
