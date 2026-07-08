package com.memora.exception;

/**
 * Lançada quando o usuário autenticado tenta acessar/modificar um
 * recurso (nota, quiz, evento, etc) que pertence a outro usuário.
 * Mapeada para HTTP 403 (Forbidden).
 */
public class AcessoNegadoException extends RuntimeException {

    public AcessoNegadoException(String mensagem) {
        super(mensagem);
    }
}
