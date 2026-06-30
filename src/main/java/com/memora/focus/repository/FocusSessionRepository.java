package com.memora.focus.repository;

import com.memora.focus.entity.FocusSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface FocusSessionRepository extends JpaRepository<FocusSession, UUID> {

    List<FocusSession> findByUsuarioIdAndConcluidaEmBetween(UUID usuarioId, LocalDateTime inicio, LocalDateTime fim);
}
