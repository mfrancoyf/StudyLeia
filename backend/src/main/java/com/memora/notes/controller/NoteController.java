package com.memora.notes.controller;

import com.memora.config.security.UsuarioAutenticado;
import com.memora.notes.dto.NoteRequest;
import com.memora.notes.dto.NoteResponse;
import com.memora.notes.service.NoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
@Tag(name = "Anotações", description = "CRUD de anotações de estudo")
public class NoteController {

    private final NoteService noteService;

    @GetMapping
    @Operation(summary = "Lista todas as anotações do usuário autenticado")
    public ResponseEntity<List<NoteResponse>> listar() {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(noteService.listarPorUsuario(usuario.getId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca uma anotação específica pelo id")
    public ResponseEntity<NoteResponse> buscar(@PathVariable UUID id) {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(noteService.buscarPorId(id, usuario.getId()));
    }

    @PostMapping
    @Operation(summary = "Cria uma nova anotação e concede XP (+5)")
    public ResponseEntity<NoteResponse> criar(@Valid @RequestBody NoteRequest request) {
        var usuario = UsuarioAutenticado.obter();
        NoteResponse resposta = noteService.criar(usuario, request);
        return ResponseEntity.status(201).body(resposta);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza uma anotação existente")
    public ResponseEntity<NoteResponse> atualizar(@PathVariable UUID id, @Valid @RequestBody NoteRequest request) {
        var usuario = UsuarioAutenticado.obter();
        return ResponseEntity.ok(noteService.atualizar(id, usuario.getId(), request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove uma anotação")
    public ResponseEntity<Void> excluir(@PathVariable UUID id) {
        var usuario = UsuarioAutenticado.obter();
        noteService.excluir(id, usuario.getId());
        return ResponseEntity.noContent().build();
    }
}
