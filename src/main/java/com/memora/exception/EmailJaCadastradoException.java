package com.memora.exception;

/**
 * Lançada ao tentar cadastrar um e-mail que já existe na base.
 * Mapeada para HTTP 409 (Conflict).
 */
public class EmailJaCadastradoException extends RuntimeException {

    public EmailJaCadastradoException(String email) {
        super("Já existe uma conta cadastrada com o e-mail: " + email);
    }
}
