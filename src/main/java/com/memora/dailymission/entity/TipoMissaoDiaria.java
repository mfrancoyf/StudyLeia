package com.memora.dailymission.entity;

/**
 * Cada tipo carrega sua própria meta padrão (quantidade necessária
 * para concluir a missão). DEZ_QUESTOES precisa de 10 respostas,
 * por exemplo. A meta fica centralizada aqui para evitar duplicação
 * entre o Service que gera as missões do dia e o que verifica conclusão.
 */
public enum TipoMissaoDiaria {
    RESPONDER_10_QUESTOES(10),
    CRIAR_1_ANOTACAO(1),
    ESTUDAR_30_MINUTOS(30),
    COMPLETAR_PLANO_DO_DIA(1);

    private final int metaPadrao;

    TipoMissaoDiaria(int metaPadrao) {
        this.metaPadrao = metaPadrao;
    }

    public int getMetaPadrao() {
        return metaPadrao;
    }
}
