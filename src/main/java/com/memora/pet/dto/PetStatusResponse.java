package com.memora.pet.dto;

public record PetStatusResponse(
        String nomePet,
        String humor,
        String estagioEvolucao,
        int totalCarinhos
) {
}
