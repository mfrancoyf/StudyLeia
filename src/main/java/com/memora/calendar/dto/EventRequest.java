package com.memora.calendar.dto;

import com.memora.calendar.entity.TipoEvento;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record EventRequest(

        @NotBlank(message = "O título do evento é obrigatório")
        String titulo,

        @NotNull(message = "Informe o tipo do evento")
        TipoEvento tipo,

        @NotNull(message = "Informe a data e hora do evento")
        LocalDateTime dataHora,

        String descricao
) {
}
