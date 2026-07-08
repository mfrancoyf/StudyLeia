package com.memora.quiz.dto;

import com.memora.quiz.entity.Dificuldade;
import com.memora.quiz.entity.OrigemQuiz;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record QuizResponse(
        UUID id,
        String titulo,
        String tema,
        Dificuldade dificuldade,
        OrigemQuiz origem,
        int totalQuestoes,
        LocalDateTime criadoEm,
        List<QuestaoResponse> questoes
) {
    public record QuestaoResponse(
            UUID id,
            String pergunta,
            int ordem,
            List<AlternativaResponse> alternativas
    ) {
    }

    /**
     * Importante: este DTO NUNCA expõe qual alternativa é a correta
     * (campo "correta" fica de fora) — assim a usuária não pode "ver"
     * a resposta certa inspecionando a resposta da API antes de
     * responder. A correção é feita no backend, no momento do envio.
     */
    public record AlternativaResponse(
            UUID id,
            String texto,
            String letra
    ) {
    }
}
