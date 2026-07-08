package com.memora.dailymission.repository;

import com.memora.dailymission.entity.DailyMission;
import com.memora.dailymission.entity.TipoMissaoDiaria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DailyMissionRepository extends JpaRepository<DailyMission, UUID> {

    List<DailyMission> findByUsuarioIdAndData(UUID usuarioId, LocalDate data);

    Optional<DailyMission> findByUsuarioIdAndDataAndTipo(UUID usuarioId, LocalDate data, TipoMissaoDiaria tipo);

    boolean existsByUsuarioIdAndData(UUID usuarioId, LocalDate data);
}
