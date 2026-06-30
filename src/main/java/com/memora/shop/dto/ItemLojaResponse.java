package com.memora.shop.dto;

import java.util.UUID;

/**
 * Representação unificada de um item da loja, seja ele um cosmético
 * ou um cenário — usada para o catálogo combinado e para indicar se
 * o usuário já possui/equipou o item. `categoria` carrega o valor do
 * enum específico (CategoriaCosmetico para cosméticos, ou um literal
 * fixo "CENARIO" para cenários).
 */
public record ItemLojaResponse(
        UUID id,
        String tipoItem,
        String nome,
        String descricao,
        String categoria,
        String raridade,
        long preco,
        String icone,
        String gradiente,
        boolean possuido,
        boolean equipado
) {
}
