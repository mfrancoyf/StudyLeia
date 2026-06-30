package com.memora.garden.controller;

import com.memora.config.security.UsuarioAutenticado;
import com.memora.garden.dto.GardenResponse;
import com.memora.garden.dto.PlantaResponse;
import com.memora.garden.dto.PlantarRequest;
import com.memora.garden.service.GardenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/garden")
@RequiredArgsConstructor
@Tag(name = "Jardim da Leia", description = "Sementes, plantio e crescimento de plantas conforme o progresso de estudos")
public class GardenController {

    private final GardenService gardenService;

    @GetMapping
    @Operation(summary = "Retorna o jardim do usuário com o saldo de sementes e todas as plantas, com estágio de crescimento atualizado")
    public ResponseEntity<GardenResponse> jardim() {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(gardenService.obterJardim(usuario.getId()));
    }

    @PostMapping("/plantar")
    @Operation(summary = "Planta uma semente num vasinho específico, consumindo sementes do saldo")
    public ResponseEntity<PlantaResponse> plantar(@Valid @RequestBody PlantarRequest request) {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.status(201).body(gardenService.plantar(usuario, request));
    }

    @PostMapping("/{plantaId}/colher")
    @Operation(summary = "Colhe uma planta que já floresceu completamente")
    public ResponseEntity<Void> colher(@PathVariable UUID plantaId) {
        var usuario = UsuarioAutenticado.obter();
        gardenService.colher(usuario.getId(), plantaId);
        return ResponseEntity.ok().build();
    }
}
