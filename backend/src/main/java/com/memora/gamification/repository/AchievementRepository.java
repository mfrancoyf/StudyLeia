package com.memora.gamification.repository;

import com.memora.gamification.entity.Achievement;
import com.memora.gamification.entity.TipoConquista;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AchievementRepository extends JpaRepository<Achievement, UUID> {

    List<Achievement> findByUsuarioIdOrderByDesbloqueadaEmDesc(UUID usuarioId);

    boolean existsByUsuarioIdAndTipo(UUID usuarioId, TipoConquista tipo);
}
