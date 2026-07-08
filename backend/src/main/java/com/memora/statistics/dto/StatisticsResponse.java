package com.memora.statistics.dto;

import java.util.List;

public record StatisticsResponse(
        long totalHorasEstudadas,
        long xpAcumulado,
        long totalQuestoesRespondidas,
        long totalQuestoesCorretas,
        double taxaAcertoGeral,
        int sequenciaAtual,
        int maiorSequencia,
        int diasAtivos,
        List<PontoSerieTemporal> xpPorSemana,
        List<PontoSerieTemporal> xpPorMes,
        List<PontoSerieTemporal> atividadeSemanal,
        List<PontoSerieTemporal> atividadeMensal,
        List<EstatisticaPorTema> acertosPorMateria,
        List<EstatisticaPorTema> materiasMaisEstudadas,
        List<EstatisticaPorTema> materiasMenosEstudadas
) {
}
