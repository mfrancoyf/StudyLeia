package com.memora.studyplan.repository;

import com.memora.studyplan.entity.StudyPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StudyPlanRepository extends JpaRepository<StudyPlan, UUID> {

    List<StudyPlan> findByUsuarioIdOrderByDataProvaAsc(UUID usuarioId);

    @Query("select sp from StudyPlan sp left join fetch sp.itens where sp.id = :id")
    Optional<StudyPlan> buscarComItens(UUID id);
}
