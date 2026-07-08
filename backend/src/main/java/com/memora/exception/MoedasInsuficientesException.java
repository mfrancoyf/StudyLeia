package com.memora.exception;

/**
 * Lançada quando o usuário tenta comprar um item da loja sem ter
 * moedas suficientes. Mapeada para HTTP 402 (Payment Required) —
 * uso semântico do código, já que não há pagamento real envolvido,
 * apenas a moeda virtual do jogo.
 */
public class MoedasInsuficientesException extends RuntimeException {

    public MoedasInsuficientesException(String mensagem) {
        super(mensagem);
    }
}
