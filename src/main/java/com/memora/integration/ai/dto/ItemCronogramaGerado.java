package com.memora.integration.ai.dto;

import java.time.LocalDate;

public record ItemCronogramaGerado(
        LocalDate data,
        String assunto,
        String tipo, // "ESTUDO", "REVISAO" ou "SIMULADO"
        String descricao
) {
}
