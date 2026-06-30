package com.memora.shop.dto;

import java.util.UUID;

public record InventoryItemResponse(
        UUID itemRefId,
        String tipoItem,
        String nome,
        String icone,
        String posicaoOverlay,
        String gradiente,
        boolean equipado
) {
}
