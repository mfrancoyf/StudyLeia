package com.memora.auth.dto;

import java.util.UUID;

public record PerfilResponse(
        UUID id,
        String nome,
        String email,
        String nomeDaPet,
        String corTema
) {
}
