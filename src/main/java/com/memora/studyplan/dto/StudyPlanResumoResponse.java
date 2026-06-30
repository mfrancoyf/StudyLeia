package com.memora.studyplan.dto;

import java.time.LocalDate;
import java.util.UUID;

public record StudyPlanResumoResponse(
        UUID id,
        String materia,
        LocalDate dataProva,
        boolean concluido,
        double percentualConcluido,
        int totalItens
) {
}
