package com.memora.auth.dto;

import java.util.UUID;

public record AuthResponse(
        String token,
        UUID usuarioId,
        String nome,
        String email,
        String nomeDaPet
) {
}
