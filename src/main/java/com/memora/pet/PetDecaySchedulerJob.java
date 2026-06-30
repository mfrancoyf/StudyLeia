package com.memora.pet;

import com.memora.pet.repository.PetStatusRepository;
import com.memora.pet.service.PetService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Verifica periodicamente todos os PetStatus em busca de usuárias
 * inativas há muito tempo, baixando o humor da Leia gradualmente
 * (ver PetService.decairHumorPorInatividade). Roda a cada 6 horas —
 * frequência baixa o suficiente para não pesar no banco, e alta o
 * suficiente para a Leia reagir em tempo razoável à ausência.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PetDecaySchedulerJob {

    private final PetStatusRepository petStatusRepository;
    private final PetService petService;

    @Scheduled(cron = "0 0 */6 * * *")
    public void decairHumorDosInativos() {
        var todosOsStatus = petStatusRepository.findAll();
        int processados = 0;

        for (var status : todosOsStatus) {
            petService.decairHumorPorInatividade(status);
            processados++;
        }

        log.info("Job de decaimento de humor executado — {} pets verificados.", processados);
    }
}
