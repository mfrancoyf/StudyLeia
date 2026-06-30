package com.memora.dailymission.dto;

import java.util.UUID;

public record DailyMissionResponse(
        UUID id,
        String tipo,
        String titulo,
        int progresso,
        int meta,
        boolean concluida
) {
}
