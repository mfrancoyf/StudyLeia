package com.memora.garden.entity;

/**
 * Cada tipo de planta tem seu próprio custo em sementes e tempo de
 * maturação completa, dando variedade ao Jardim sem precisar de
 * configuração externa.
 */
public enum TipoPlanta {
    FLOR_AZUL("Flor Azul", 5, 3),
    GIRASSOL("Girassol", 8, 5),
    ROSA("Rosa", 10, 4),
    LAVANDA("Lavanda", 12, 6);

    private final String nomeExibicao;
    private final int custoSementes;
    private final int diasParaFlorescer;

    TipoPlanta(String nomeExibicao, int custoSementes, int diasParaFlorescer) {
        this.nomeExibicao = nomeExibicao;
        this.custoSementes = custoSementes;
        this.diasParaFlorescer = diasParaFlorescer;
    }

    public String getNomeExibicao() {
        return nomeExibicao;
    }

    public int getCustoSementes() {
        return custoSementes;
    }

    public int getDiasParaFlorescer() {
        return diasParaFlorescer;
    }
}
