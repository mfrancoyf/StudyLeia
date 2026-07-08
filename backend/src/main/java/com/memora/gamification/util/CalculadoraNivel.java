package com.memora.gamification.util;

/**
 * Fórmula de progressão de nível ao estilo Duolingo: cada nível exige
 * um pouco mais de XP que o anterior (crescimento quadrático suave),
 * para a usuária sentir avanço rápido no início e desafio crescente
 * mais adiante — sem precisar de uma tabela de níveis "hardcoded".
 *
 * XP necessário para alcançar o nível N (cumulativo) = 50 * N * (N+1)/2
 * Isso dá, por exemplo:
 *   Nível 1 ->     0 XP
 *   Nível 2 ->   100 XP
 *   Nível 3 ->   300 XP
 *   Nível 5 ->   750 XP
 *   Nível 10 -> 2750 XP
 */
public final class CalculadoraNivel {

    private static final int FATOR_BASE = 50;

    private CalculadoraNivel() {
    }

    public static int calcularNivel(long xpTotal) {
        int nivel = 1;
        while (xpTotal >= xpAcumuladoParaNivel(nivel + 1)) {
            nivel++;
        }
        return nivel;
    }

    public static long xpAcumuladoParaNivel(int nivel) {
        long n = nivel - 1L;
        return FATOR_BASE * n * (n + 1) / 2;
    }

    public static long xpFaltanteParaProximoNivel(long xpTotal) {
        int nivelAtual = calcularNivel(xpTotal);
        long xpProximoNivel = xpAcumuladoParaNivel(nivelAtual + 1);
        return Math.max(0, xpProximoNivel - xpTotal);
    }

    public static double progressoPercentualNivelAtual(long xpTotal) {
        int nivelAtual = calcularNivel(xpTotal);
        long xpInicioNivel = xpAcumuladoParaNivel(nivelAtual);
        long xpFimNivel = xpAcumuladoParaNivel(nivelAtual + 1);
        long faixa = xpFimNivel - xpInicioNivel;
        if (faixa <= 0) {
            return 100.0;
        }
        double progresso = ((double) (xpTotal - xpInicioNivel) / faixa) * 100.0;
        return Math.min(100.0, Math.max(0.0, progresso));
    }
}
