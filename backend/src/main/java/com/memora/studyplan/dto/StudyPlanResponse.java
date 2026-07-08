package com.memora.studyplan.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record StudyPlanResponse(
        UUID id,
        String materia,
        LocalDate dataProva,
        double horasDisponiveisPorDia,
        String resumo,
        boolean concluido,
        double percentualConcluido,
        List<ItemResponse> itens
) {
    public record ItemResponse(
            UUID id,
            LocalDate data,
            String assunto,
            String tipo,
            String descricao,
            boolean concluido
    ) {
    }
}
