package com.memora.statistics.dto;

public record EstatisticaPorTema(
        String tema,
        long totalRespondidas,
        long totalCorretas,
        double taxaAcerto
) {
}
