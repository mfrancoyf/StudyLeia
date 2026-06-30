package com.memora.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<Void> tratarRecursoEstatico(NoResourceFoundException ex) {
        // Silencia 404s de recursos estáticos (favicon.ico, etc.)
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroResponse> tratarNaoEncontrado(RecursoNaoEncontradoException ex, HttpServletRequest req) {
        log.info("Recurso não encontrado: {}", ex.getMessage());
        return construir(HttpStatus.NOT_FOUND, ex.getMessage(), req);
    }

    @ExceptionHandler(EmailJaCadastradoException.class)
    public ResponseEntity<ErroResponse> tratarEmailDuplicado(EmailJaCadastradoException ex, HttpServletRequest req) {
        return construir(HttpStatus.CONFLICT, ex.getMessage(), req);
    }

    @ExceptionHandler({CredenciaisInvalidasException.class, BadCredentialsException.class})
    public ResponseEntity<ErroResponse> tratarCredenciaisInvalidas(Exception ex, HttpServletRequest req) {
        return construir(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos", req);
    }

    @ExceptionHandler(AcessoNegadoException.class)
    public ResponseEntity<ErroResponse> tratarAcessoNegado(AcessoNegadoException ex, HttpServletRequest req) {
        return construir(HttpStatus.FORBIDDEN, ex.getMessage(), req);
    }

    @ExceptionHandler(MoedasInsuficientesException.class)
    public ResponseEntity<ErroResponse> tratarMoedasInsuficientes(MoedasInsuficientesException ex, HttpServletRequest req) {
        return construir(HttpStatus.PAYMENT_REQUIRED, ex.getMessage(), req);
    }

    @ExceptionHandler(IntegracaoIAException.class)
    public ResponseEntity<ErroResponse> tratarErroIA(IntegracaoIAException ex, HttpServletRequest req) {
        log.error("Erro na integração com IA: {}", ex.getMessage(), ex);
        return construir(HttpStatus.BAD_GATEWAY, "Não foi possível gerar o conteúdo com IA agora. Tente novamente em instantes.", req);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErroResponse> tratarIntegridade(DataIntegrityViolationException ex, HttpServletRequest req) {
        log.warn("Violação de integridade de dados: {}", ex.getMessage());
        return construir(HttpStatus.CONFLICT, "Operação viola uma restrição do banco de dados (registro duplicado ou referência inválida).", req);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponse> tratarValidacao(MethodArgumentNotValidException ex, HttpServletRequest req) {
        Map<String, String> campos = new HashMap<>();
        for (FieldError erro : ex.getBindingResult().getFieldErrors()) {
            campos.put(erro.getField(), erro.getDefaultMessage());
        }
        ErroResponse corpo = new ErroResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Dados inválidos",
                "Verifique os campos informados",
                req.getRequestURI(),
                campos
        );
        return ResponseEntity.badRequest().body(corpo);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResponse> tratarGenerico(Exception ex, HttpServletRequest req) {
        log.error("Erro inesperado: {}", ex.getMessage(), ex);
        return construir(HttpStatus.INTERNAL_SERVER_ERROR, "Ocorreu um erro inesperado. Tente novamente.", req);
    }

    private ResponseEntity<ErroResponse> construir(HttpStatus status, String mensagem, HttpServletRequest req) {
        ErroResponse corpo = new ErroResponse(status.value(), status.getReasonPhrase(), mensagem, req.getRequestURI());
        return ResponseEntity.status(status).body(corpo);
    }
}