package com.memora.gamification.repository;

import com.memora.gamification.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserProgressRepository extends JpaRepository<UserProgress, UUID> {

    Optional<UserProgress> findByUsuarioId(UUID usuarioId);
}
