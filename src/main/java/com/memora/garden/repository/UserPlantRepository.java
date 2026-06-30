package com.memora.garden.repository;

import com.memora.garden.entity.UserPlant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserPlantRepository extends JpaRepository<UserPlant, UUID> {

    List<UserPlant> findByGardenIdAndColhidaFalse(UUID gardenId);

    List<UserPlant> findByGardenId(UUID gardenId);

    long countByGardenIdAndPosicaoVaso(UUID gardenId, int posicaoVaso);
}
