package com.memora.config.security;

import com.memora.auth.entity.Usuario;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Atalho usado pelos Controllers para obter o Usuario autenticado
 * atual sem precisar injetar @AuthenticationPrincipal em toda
 * assinatura de método. Centraliza essa leitura num único lugar.
 */
public final class UsuarioAutenticado {

    private UsuarioAutenticado() {
    }

    public static Usuario obter() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof Usuario usuario) {
            return usuario;
        }
        throw new IllegalStateException("Nenhum usuário autenticado no contexto de segurança.");
    }
}
