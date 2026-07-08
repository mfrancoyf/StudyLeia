package com.memora.gamification.dto;

/**
 * Resultado de uma operação de concessão de XP — usado pelos
 * Controllers para informar ao frontend se o usuário subiu de nível
 * (para disparar a animação de "level up" da Leia) e se a Leia
 * evoluiu de estágio visual.
 */
public record RecompensaResponse(
        int xpGanho,
        int moedasGanhas,
        long xpTotal,
        int nivelAnterior,
        int nivelAtual,
        boolean subiuDeNivel,
        boolean leiaEvoluiu,
        String novoEstagioEvolucao
) {
}
