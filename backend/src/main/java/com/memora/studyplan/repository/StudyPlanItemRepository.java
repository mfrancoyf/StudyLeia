package com.memora.studyplan.repository;

import com.memora.studyplan.entity.StudyPlanItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface StudyPlanItemRepository extends JpaRepository<StudyPlanItem, UUID> {
}
