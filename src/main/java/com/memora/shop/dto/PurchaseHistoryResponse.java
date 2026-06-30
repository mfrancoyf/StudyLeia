package com.memora.shop.dto;

import java.time.LocalDateTime;

public record PurchaseHistoryResponse(
        String tipoItem,
        String nomeItem,
        long precoPago,
        LocalDateTime compradoEm
) {
}
