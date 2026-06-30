package com.memora.exception;

/**
 * Lançada quando e-mail/senha não correspondem a um usuário válido.
 * Mapeada para HTTP 401 (Unauthorized).
 */
public class CredenciaisInvalidasException extends RuntimeException {

    public CredenciaisInvalidasException(String mensagem) {
        super(mensagem);
    }
}
