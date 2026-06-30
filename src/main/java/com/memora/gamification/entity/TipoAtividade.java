package com.memora.gamification.entity;

/**
 * Toda ação da usuária que gera XP/moedas é classificada num desses
 * tipos. Centralizar aqui os valores de recompensa evita "números
 * mágicos" espalhados pelos Services de cada módulo.
 */
public enum TipoAtividade {
    QUIZ_RESPOSTA_CORRETA(10, 2),
    QUIZ_RESPOSTA_ERRADA(2, 0),
    QUIZ_COMPLETO(15, 5),
    ANOTACAO_CRIADA(5, 1),
    PLANO_ESTUDOS_CONCLUIDO(20, 8),
    SESSAO_FOCO_CONCLUIDA(12, 3),
    MISSAO_DIARIA_CONCLUIDA(8, 4),
    EVENTO_CALENDARIO_CRIADO(3, 1);

    private final int xp;
    private final int moedas;

    TipoAtividade(int xp, int moedas) {
        this.xp = xp;
        this.moedas = moedas;
    }

    public int getXp() {
        return xp;
    }

    public int getMoedas() {
        return moedas;
    }
}
