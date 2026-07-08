package com.memora.auth.controller;

import com.memora.auth.dto.*;
import com.memora.auth.service.AuthService;
import com.memora.config.security.UsuarioAutenticado;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Expõe os endpoints de autenticação. Controllers não contêm regra
 * de negócio — apenas recebem a requisição, delegam ao Service e
 * traduzem o resultado em uma resposta HTTP (incluindo o cookie
 * HttpOnly com o JWT, usado pelas páginas Thymeleaf/HTMX).
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticação", description = "Cadastro, login, recuperação de senha e perfil")
public class AuthController {

    private static final String NOME_COOKIE = "memora_token";
    private static final int COOKIE_MAX_AGE_SEGUNDOS = 60 * 60 * 2; // 2 horas

    private final AuthService authService;

    @PostMapping("/registro")
    @Operation(summary = "Cria uma nova conta de usuário e já provisiona o estado inicial da Leia")
    public ResponseEntity<AuthResponse> registrar(@Valid @RequestBody RegistroRequest request, HttpServletResponse response) {
        AuthResponse resultado = authService.registrar(request);
        adicionarCookieToken(response, resultado.token());
        return ResponseEntity.ok(resultado);
    }

    @PostMapping("/login")
    @Operation(summary = "Autentica um usuário e retorna o token JWT (também setado como cookie HttpOnly)")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        AuthResponse resultado = authService.login(request);
        adicionarCookieToken(response, resultado.token());
        return ResponseEntity.ok(resultado);
    }

    @PostMapping("/logout")
    @Operation(summary = "Invalida o cookie de sessão do usuário")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(NOME_COOKIE, "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/esqueci-senha")
    @Operation(summary = "Envia (ou loga, em ambiente local) um token de redefinição de senha por e-mail")
    public ResponseEntity<Void> esqueciSenha(@Valid @RequestBody EsqueciSenhaRequest request) {
        authService.solicitarRecuperacaoSenha(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/redefinir-senha")
    @Operation(summary = "Redefine a senha a partir de um token válido")
    public ResponseEntity<Void> redefinirSenha(@Valid @RequestBody RedefinirSenhaRequest request) {
        authService.redefinirSenha(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/perfil")
    @Operation(summary = "Retorna o perfil do usuário autenticado")
    public ResponseEntity<PerfilResponse> obterPerfil() {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(authService.obterPerfil(usuario.getId()));
    }

    @PutMapping("/perfil")
    @Operation(summary = "Atualiza nome, nome da pet e cor do tema do usuário autenticado")
    public ResponseEntity<PerfilResponse> atualizarPerfil(@Valid @RequestBody AtualizarPerfilRequest request) {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(authService.atualizarPerfil(usuario.getId(), request));
    }

    private void adicionarCookieToken(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie.from(NOME_COOKIE, token)
                .httpOnly(true)
                .path("/")
                .maxAge(COOKIE_MAX_AGE_SEGUNDOS)
                .sameSite("Lax")
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
    }
}
