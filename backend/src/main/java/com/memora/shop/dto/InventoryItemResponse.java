package com.memora.shop.dto;

import java.util.UUID;

public record InventoryItemResponse(
        UUID itemRefId,
        String tipoItem,
        String nome,
        String icone,
        // Categoria do cosmético (LACO, OCULOS, CHAPEU, GRAVATA, ACESSORIO_ESPECIAL).
        // null para itens do tipo CENARIO. Usada pelo frontend para resolver a
        // configuração de encaixe do AccessoryLayer (ver accessoryConfig.tsx).
        String categoria,
        String posicaoOverlay,
        String gradiente,
        String codigoCena,
        boolean equipado
) {
}
