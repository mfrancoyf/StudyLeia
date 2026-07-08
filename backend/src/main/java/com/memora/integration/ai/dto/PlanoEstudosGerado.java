package com.memora.integration.ai.dto;

import java.util.List;

public record PlanoEstudosGerado(
        String resumo,
        List<ItemCronogramaGerado> itens
) {
}
