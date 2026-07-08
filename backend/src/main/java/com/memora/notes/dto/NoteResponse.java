package com.memora.notes.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record NoteResponse(
        UUID id,
        String titulo,
        String conteudo,
        String categoria,
        List<String> tags,
        LocalDateTime criadoEm,
        LocalDateTime atualizadoEm
) {
}
