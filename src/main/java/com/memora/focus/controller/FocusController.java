package com.memora.focus.controller;

import com.memora.config.security.UsuarioAutenticado;
import com.memora.focus.dto.ConcluirSessaoFocoRequest;
import com.memora.focus.dto.SessaoFocoResultado;
import com.memora.focus.service.FocusService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/focus")
@RequiredArgsConstructor
@Tag(name = "Modo Foco", description = "Sessões de Pomodoro — a Leia estuda junto durante o foco")
public class FocusController {

    private final FocusService focusService;

    @PostMapping("/concluir")
    @Operation(summary = "Registra a conclusão de uma sessão de foco ou pausa e concede XP (apenas para FOCO)")
    public ResponseEntity<SessaoFocoResultado> concluir(@Valid @RequestBody ConcluirSessaoFocoRequest request) {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(focusService.concluirSessao(usuario, request));
    }

    @GetMapping("/minutos-hoje")
    @Operation(summary = "Retorna o total de minutos de foco concluídos hoje pelo usuário autenticado")
    public ResponseEntity<Long> minutosHoje() {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(focusService.somarMinutosFocoHoje(usuario.getId()));
    }
}
