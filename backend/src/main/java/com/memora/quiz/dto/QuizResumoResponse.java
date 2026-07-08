package com.memora.quiz.dto;

import com.memora.quiz.entity.Dificuldade;
import com.memora.quiz.entity.OrigemQuiz;

import java.time.LocalDateTime;
import java.util.UUID;

public record QuizResumoResponse(
        UUID id,
        String titulo,
        String tema,
        Dificuldade dificuldade,
        OrigemQuiz origem,
        int totalQuestoes,
        LocalDateTime criadoEm
) {
}
