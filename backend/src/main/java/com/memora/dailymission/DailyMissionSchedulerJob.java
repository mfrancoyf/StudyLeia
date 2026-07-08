package com.memora.dailymission;

import com.memora.auth.entity.Usuario;
import com.memora.auth.repository.UsuarioRepository;
import com.memora.dailymission.service.DailyMissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Gera proativamente o conjunto de missões diárias de todos os
 * usuários ativos à meia-noite, em vez de depender exclusivamente da
 * geração "lazy" (que só acontece no primeiro acesso do dia da
 * usuária). Isso garante que, ao abrir o app de manhã, as missões já
 * estejam prontas e visíveis imediatamente — sem esperar a primeira
 * chamada de API criar o registro na hora.
 *
 * A geração lazy em DailyMissionService.obterMissoesDoDia continua
 * existindo como rede de segurança (ex.: usuário cadastrado depois da
 * meia-noite, ou job que falhou silenciosamente em algum dia).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DailyMissionSchedulerJob {

    private final UsuarioRepository usuarioRepository;
    private final DailyMissionService dailyMissionService;

    @Scheduled(cron = "0 1 0 * * *") // 00:01 todo dia
    public void gerarMissoesDoDiaParaTodos() {
        int processados = 0;

        for (Usuario usuario : usuarioRepository.findAll()) {
            if (!usuario.isAtivo()) {
                continue;
            }
            dailyMissionService.obterMissoesDoDia(usuario);
            processados++;
        }

        log.info("Job de geração de missões diárias executado — {} usuário(s) processados.", processados);
    }
}
