package com.memora.calendar.repository;

import com.memora.calendar.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {

    List<Event> findByUsuarioIdOrderByDataHoraAsc(UUID usuarioId);

    List<Event> findByUsuarioIdAndDataHoraBetweenOrderByDataHoraAsc(UUID usuarioId, LocalDateTime inicio, LocalDateTime fim);

    List<Event> findByDataHoraBetweenAndAlertaEnviadoFalse(LocalDateTime inicio, LocalDateTime fim);
}
