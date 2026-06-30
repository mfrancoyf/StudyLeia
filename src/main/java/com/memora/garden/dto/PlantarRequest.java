package com.memora.garden.dto;

import com.memora.garden.entity.TipoPlanta;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record PlantarRequest(

        @NotNull(message = "Informe o tipo de planta")
        TipoPlanta tipo,

        @Min(value = 0, message = "Posição do vaso inválida")
        @Max(value = 11, message = "Posição do vaso inválida")
        int posicaoVaso
) {
}
