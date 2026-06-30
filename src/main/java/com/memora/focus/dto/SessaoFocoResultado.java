package com.memora.focus.dto;

import com.memora.gamification.dto.RecompensaResponse;

public record SessaoFocoResultado(
        boolean concedeuXp,
        long totalMinutosFocoHoje,
        RecompensaResponse recompensa
) {
}
