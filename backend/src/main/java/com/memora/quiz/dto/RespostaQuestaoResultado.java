package com.memora.quiz.dto;

import com.memora.gamification.dto.RecompensaResponse;

import java.util.UUID;

/**
 * Devolvido após responder uma questão. Inclui a alternativa correta
 * (agora pode ser revelada, já que a usuária acabou de responder) e
 * a recompensa de gamificação concedida — usados pelo frontend para
 * disparar a animação certa da Leia (feliz se correto, triste/incentivo
 * se errado) e o popup de XP ganho.
 */
public record RespostaQuestaoResultado(
        boolean correta,
        UUID alternativaCorretaId,
        String mensagemIncentivo,
        RecompensaResponse recompensa
) {
}
