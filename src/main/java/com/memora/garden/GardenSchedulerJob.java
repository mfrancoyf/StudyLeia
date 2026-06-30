package com.memora.garden;

import com.memora.garden.service.GardenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Recalcula proativamente o estágio de crescimento de todas as
 * plantas de todos os jardins a cada 3 horas. Sem este job, uma
 * planta só avança de estágio quando a usuária abre a página do
 * Jardim (cálculo on-demand em GardenService.obterJardim) — o que
 * significa que ela só "veria" a planta florescida na próxima visita,
 * mesmo que o tempo/XP/metas necessários já tivessem sido atingidos
 * horas antes. Rodar isso em background mantém o estado sempre
 * atualizado, e é o que permite, por exemplo, notificações futuras de
 * "sua planta floresceu!" sem depender de a usuária estar olhando.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class GardenSchedulerJob {

    private final GardenService gardenService;

    @Scheduled(cron = "0 0 */3 * * *") // a cada 3 horas
    public void recalcularCrescimentoDasPlantas() {
        int processados = gardenService.recalcularTodosOsJardins();
        log.info("Job de recálculo do Jardim executado — {} jardim(ns) verificados.", processados);
    }
}
