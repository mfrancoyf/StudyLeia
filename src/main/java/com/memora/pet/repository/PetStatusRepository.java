package com.memora.pet.repository;

import com.memora.pet.entity.PetStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PetStatusRepository extends JpaRepository<PetStatus, UUID> {

    Optional<PetStatus> findByUsuarioId(UUID usuarioId);
}
