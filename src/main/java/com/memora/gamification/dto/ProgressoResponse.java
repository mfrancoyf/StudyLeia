package com.memora.gamification.dto;

import java.util.List;

public record ProgressoResponse(
        long xpTotal,
        int nivelAtual,
        long xpFaltanteProximoNivel,
        double progressoPercentual,
        long moedas,
        int sequenciaAtual,
        int maiorSequencia,
        List<String> conquistasDesbloqueadas
) {
}
