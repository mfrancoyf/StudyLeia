package com.memora.quiz.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ResponderQuestaoRequest(

        @NotNull(message = "É necessário informar a alternativa escolhida")
        UUID alternativaId
) {
}
