package com.memora.garden.dto;

import java.util.List;

public record GardenResponse(
        long sementes,
        long totalFloresColhidas,
        List<PlantaResponse> plantas
) {
}
