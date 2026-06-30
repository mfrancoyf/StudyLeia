package com.memora.calendar;

import com.memora.calendar.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Marca como "alertaEnviado" os eventos que entraram na janela das
 * próximas 48 horas. O frontend já consulta os eventos próximos via
 * `/api/calendar/alertas` em tempo real (sem depender deste job para
 * exibição) — este job existe para permitir, no futuro, o envio de um
 * e-mail de aviso sem reenviar para o mesmo evento repetidamente.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CalendarAlertSchedulerJob {

    private final EventRepository eventRepository;

    @Scheduled(cron = "0 0 * * * *") // a cada hora
    @Transactional
    public void marcarAlertasProximos() {
        LocalDateTime agora = LocalDateTime.now();
        var eventosProximos = eventRepository.findByDataHoraBetweenAndAlertaEnviadoFalse(agora, agora.plusHours(48));

        for (var evento : eventosProximos) {
            evento.setAlertaEnviado(true);
            eventRepository.save(evento);
        }

        if (!eventosProximos.isEmpty()) {
            log.info("Job de alertas de calendário: {} evento(s) marcados como notificados.", eventosProximos.size());
        }
    }
}
