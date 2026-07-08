package com.memora.focus.dto;

import com.memora.focus.entity.TipoSessaoFoco;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ConcluirSessaoFocoRequest(

        @NotNull(message = "Informe o tipo da sessão (FOCO ou PAUSA)")
        TipoSessaoFoco tipo,

        @Min(value = 1, message = "A duração mínima é 1 minuto")
        int duracaoMinutos
) {
}
