package com.memora.gamification.dto;

import java.time.LocalDateTime;

public record AchievementResponse(
        String tipo,
        String titulo,
        String descricao,
        LocalDateTime desbloqueadaEm
) {
}
