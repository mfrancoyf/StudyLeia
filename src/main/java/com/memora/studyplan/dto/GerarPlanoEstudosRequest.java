package com.memora.studyplan.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record GerarPlanoEstudosRequest(

        @NotBlank(message = "Informe a matéria")
        String materia,

        @NotNull(message = "Informe a data da prova")
        @Future(message = "A data da prova deve ser no futuro")
        LocalDate dataProva,

        @DecimalMin(value = "0.5", message = "Informe ao menos 0.5 hora disponível por dia")
        double horasDisponiveisPorDia
) {
}
