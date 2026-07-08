package com.memora.quiz.dto;

import com.memora.quiz.entity.Dificuldade;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record GerarQuizIARequest(

        @NotBlank(message = "Informe o tema do quiz")
        String tema,

        @Min(value = 1, message = "A quantidade mínima é 1 questão")
        @Max(value = 30, message = "A quantidade máxima é 30 questões")
        int quantidade,

        @NotNull(message = "Informe a dificuldade")
        Dificuldade dificuldade
) {
}
