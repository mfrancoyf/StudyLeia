package com.memora.quiz.entity;

/**
 * De onde o quiz veio: criado manualmente pela usuária ou gerado
 * automaticamente pela camada de IA (ver com.memora.integration.ai).
 */
public enum OrigemQuiz {
    MANUAL,
    IA
}
