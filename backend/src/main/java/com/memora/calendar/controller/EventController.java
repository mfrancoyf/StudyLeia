package com.memora.calendar.controller;

import com.memora.calendar.dto.EventRequest;
import com.memora.calendar.dto.EventResponse;
import com.memora.calendar.service.EventService;
import com.memora.config.security.UsuarioAutenticado;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
@Tag(name = "Calendário", description = "Provas, trabalhos, apresentações e lembretes")
public class EventController {

    private final EventService eventService;

    @GetMapping("/events")
    @Operation(summary = "Lista todos os eventos do usuário autenticado")
    public ResponseEntity<List<EventResponse>> listar() {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(eventService.listarPorUsuario(usuario.getId()));
    }

    @GetMapping("/alertas")
    @Operation(summary = "Lista eventos dos próximos 7 dias, para exibir alertas de proximidade")
    public ResponseEntity<List<EventResponse>> alertas() {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(eventService.listarProximosEventos(usuario.getId()));
    }

    @PostMapping("/events")
    @Operation(summary = "Cria um novo evento no calendário")
    public ResponseEntity<EventResponse> criar(@Valid @RequestBody EventRequest request) {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.status(201).body(eventService.criar(usuario, request));
    }

    @PutMapping("/events/{id}")
    @Operation(summary = "Atualiza um evento existente")
    public ResponseEntity<EventResponse> atualizar(@PathVariable UUID id, @Valid @RequestBody EventRequest request) {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(eventService.atualizar(id, usuario.getId(), request));
    }

    @DeleteMapping("/events/{id}")
    @Operation(summary = "Remove um evento")
    public ResponseEntity<Void> excluir(@PathVariable UUID id) {
        var usuario = UsuarioAutenticado.obter();
        eventService.excluir(id, usuario.getId());
        return ResponseEntity.noContent().build();
    }
}
