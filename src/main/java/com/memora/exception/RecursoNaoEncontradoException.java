package com.memora.exception;

/**
 * Lançada quando uma entidade buscada por id (ou outra chave) não
 * existe no banco. Mapeada pelo GlobalExceptionHandler para HTTP 404.
 */
public class RecursoNaoEncontradoException extends RuntimeException {

    public RecursoNaoEncontradoException(String mensagem) {
        super(mensagem);
    }
}
