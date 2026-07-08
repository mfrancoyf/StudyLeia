package com.memora.gamification.repository;

import com.memora.gamification.entity.Streak;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface StreakRepository extends JpaRepository<Streak, UUID> {

    Optional<Streak> findByUsuarioId(UUID usuarioId);
}
