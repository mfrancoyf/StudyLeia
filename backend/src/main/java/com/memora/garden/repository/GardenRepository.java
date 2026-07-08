package com.memora.garden.repository;

import com.memora.garden.entity.Garden;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface GardenRepository extends JpaRepository<Garden, UUID> {

    Optional<Garden> findByUsuarioId(UUID usuarioId);
}
