package com.memora.gamification.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("CalculadoraNivel — fórmula de progressão de nível")
class CalculadoraNivelTest {

    @ParameterizedTest(name = "nível {1} exige {0} XP acumulado")
    @CsvSource({
            "0, 1",
            "50, 2",
            "150, 3",
            "300, 4",
            "500, 5",
            "750, 6",
    })
    @DisplayName("xpAcumuladoParaNivel calcula corretamente os limiares de cada nível")
    void calcularXpAcumuladoParaNivel(long xpEsperado, int nivel) {
        assertThat(CalculadoraNivel.xpAcumuladoParaNivel(nivel)).isEqualTo(xpEsperado);
    }

    @Test
    @DisplayName("Usuário com 0 XP está no nível 1")
    void usuarioComZeroXpEstaNoNivelUm() {
        assertThat(CalculadoraNivel.calcularNivel(0)).isEqualTo(1);
    }

    @Test
    @DisplayName("Usuário com exatamente o XP do próximo limiar já sobe de nível")
    void usuarioNoLimiarExatoSobeDeNivel() {
        assertThat(CalculadoraNivel.calcularNivel(50)).isEqualTo(2);
        assertThat(CalculadoraNivel.calcularNivel(49)).isEqualTo(1);
    }

    @Test
    @DisplayName("Usuário com 750 XP está no nível 6 (referência do briefing: nível 5 = 750 XP cumulativo é o limiar do nível 6)")
    void usuarioCom750XpEstaNoNivelSeis() {
        assertThat(CalculadoraNivel.calcularNivel(750)).isEqualTo(6);
    }

    @Test
    @DisplayName("xpFaltanteParaProximoNivel retorna 0 exatamente no limiar")
    void xpFaltanteNoLimiarExato() {
        assertThat(CalculadoraNivel.xpFaltanteParaProximoNivel(50)).isEqualTo(100);
        assertThat(CalculadoraNivel.xpFaltanteParaProximoNivel(0)).isEqualTo(50);
    }

    @Test
    @DisplayName("progressoPercentualNivelAtual fica entre 0 e 100 em qualquer ponto da faixa")
    void progressoPercentualSempreEntreZeroECem() {
        for (long xp = 0; xp <= 5000; xp += 37) {
            double progresso = CalculadoraNivel.progressoPercentualNivelAtual(xp);
            assertThat(progresso).isBetween(0.0, 100.0);
        }
    }

    @Test
    @DisplayName("progressoPercentualNivelAtual é 0% no início exato de um nível")
    void progressoZeroNoInicioDoNivel() {
        long xpInicioNivel3 = CalculadoraNivel.xpAcumuladoParaNivel(3);
        assertThat(CalculadoraNivel.progressoPercentualNivelAtual(xpInicioNivel3)).isEqualTo(0.0);
    }
}
