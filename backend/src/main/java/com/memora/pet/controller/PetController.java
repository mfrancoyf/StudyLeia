package com.memora.pet.controller;

import com.memora.config.security.UsuarioAutenticado;
import com.memora.pet.dto.PetStatusResponse;
import com.memora.pet.entity.PetStatus;
import com.memora.pet.service.PetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pet")
@RequiredArgsConstructor
@Tag(name = "Leia (Pet)", description = "Estado emocional e evolução visual da Leia")
public class PetController {

    private final PetService petService;

    @GetMapping("/status")
    @Operation(summary = "Retorna o humor e estágio de evolução atuais da Leia")
    public ResponseEntity<PetStatusResponse> status() {
        var usuario = UsuarioAutenticado.obter();
        PetStatus status = petService.buscarPorUsuario(usuario.getId());
        return ResponseEntity.ok(toResponse(status));
    }

    @PostMapping("/carinho")
    @Operation(summary = "Registra um clique de carinho direto na Leia (sobe o humor levemente)")
    public ResponseEntity<PetStatusResponse> carinho() {
        var usuario = UsuarioAutenticado.obter();
        petService.registrarCarinho(usuario.getId());
        PetStatus status = petService.buscarPorUsuario(usuario.getId());
        return ResponseEntity.ok(toResponse(status));
    }

    private PetStatusResponse toResponse(PetStatus status) {
        return new PetStatusResponse(
                status.getNomePet(),
                status.getHumor().name(),
                status.getEstagioEvolucao().name(),
                status.getTotalCarinhos()
        );
    }
}
