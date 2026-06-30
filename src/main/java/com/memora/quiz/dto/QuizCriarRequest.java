package com.memora.quiz.dto;

import com.memora.quiz.entity.Dificuldade;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record QuizCriarRequest(

        @NotBlank(message = "O título do quiz é obrigatório")
        @Size(max = 150, message = "O título deve ter no máximo 150 caracteres")
        String titulo,

        @Size(max = 100, message = "O tema deve ter no máximo 100 caracteres")
        String tema,

        @NotNull(message = "A dificuldade é obrigatória")
        Dificuldade dificuldade,

        @NotEmpty(message = "O quiz precisa ter ao menos uma questão")
        @Valid
        List<QuizQuestionRequest> questoes
) {

    public record QuizQuestionRequest(

            @NotBlank(message = "O texto da pergunta é obrigatório")
            String pergunta,

            @NotEmpty(message = "A questão precisa ter alternativas")
            @Size(min = 2, max = 6, message = "A questão deve ter entre 2 e 6 alternativas")
            @Valid
            List<AlternativaRequest> alternativas
    ) {
    }

    public record AlternativaRequest(

            @NotBlank(message = "O texto da alternativa é obrigatório")
            String texto,

            @NotBlank(message = "A letra da alternativa é obrigatória")
            String letra,

            boolean correta
    ) {
    }
}
