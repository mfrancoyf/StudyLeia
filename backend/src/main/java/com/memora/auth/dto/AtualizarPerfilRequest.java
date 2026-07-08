package com.memora.auth.dto;

import jakarta.validation.constraints.Size;

public record AtualizarPerfilRequest(

        @Size(max = 100, message = "O nome deve ter no máximo 100 caracteres")
        String nome,

        @Size(max = 60, message = "O nome da pet deve ter no máximo 60 caracteres")
        String nomeDaPet,

        String corTema
) {
}
