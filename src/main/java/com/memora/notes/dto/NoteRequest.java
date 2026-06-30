package com.memora.notes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record NoteRequest(

        @NotBlank(message = "O título é obrigatório")
        @Size(max = 200, message = "O título deve ter no máximo 200 caracteres")
        String titulo,

        @NotBlank(message = "O conteúdo é obrigatório")
        String conteudo,

        @Size(max = 80, message = "A categoria deve ter no máximo 80 caracteres")
        String categoria,

        List<String> tags
) {
}
