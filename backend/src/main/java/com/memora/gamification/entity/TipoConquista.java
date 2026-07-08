package com.memora.gamification.entity;

/**
 * Cada valor representa uma regra de desbloqueio de badge distinta.
 * O AchievementService verifica essas regras após cada atividade
 * relevante (resposta de quiz, criação de nota, etc).
 */
public enum TipoConquista {
    PRIMEIRA_PROVA,
    SEQUENCIA_7_DIAS,
    SEQUENCIA_30_DIAS,
    CEM_QUESTOES_RESPONDIDAS,
    MIL_XP,
    CINCO_MIL_XP,
    PRIMEIRA_ANOTACAO,
    PRIMEIRO_PLANO_CONCLUIDO,
    DEZ_QUIZZES_CRIADOS,
    NIVEL_10,
    NIVEL_20,
    NIVEL_30
}
