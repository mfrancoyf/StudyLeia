package com.memora.shop.dto;

public record CompraResultado(
        boolean sucesso,
        String nomeItem,
        long precoPago,
        long moedasRestantes
) {
}
