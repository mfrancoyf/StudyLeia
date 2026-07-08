package com.memora.dashboard.controller;

import com.memora.config.security.UsuarioAutenticado;
import com.memora.dashboard.dto.DashboardResponse;
import com.memora.dashboard.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Dados consolidados da tela inicial")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    @Operation(summary = "Retorna saudação, status da Leia, progresso de gamificação, próximos eventos e missões do dia")
    public ResponseEntity<DashboardResponse> dashboard() {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(dashboardService.montarDashboard(usuario));
    }
}
