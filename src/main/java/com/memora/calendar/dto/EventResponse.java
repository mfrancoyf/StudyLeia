package com.memora.calendar.dto;

import com.memora.calendar.entity.TipoEvento;

import java.time.LocalDateTime;
import java.util.UUID;

public record EventResponse(
        UUID id,
        String titulo,
        TipoEvento tipo,
        LocalDateTime dataHora,
        String descricao,
        long diasRestantes
) {
}
