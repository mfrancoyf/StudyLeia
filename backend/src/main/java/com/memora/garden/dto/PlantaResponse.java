package com.memora.garden.dto;

import java.util.UUID;

public record PlantaResponse(
        UUID id,
        int posicaoVaso,
        String tipo,
        String nomeExibicao,
        String estagio,
        double progressoPercentual,
        boolean colhida
) {
}
