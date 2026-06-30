package com.memora.notes.repository;

import com.memora.notes.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NoteRepository extends JpaRepository<Note, UUID> {

    List<Note> findByUsuarioIdOrderByAtualizadoEmDesc(UUID usuarioId);

    List<Note> findByUsuarioIdAndCategoriaIgnoreCaseOrderByAtualizadoEmDesc(UUID usuarioId, String categoria);

    long countByUsuarioId(UUID usuarioId);
}
