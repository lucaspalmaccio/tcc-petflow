package br.com.petflow.dto;

public record LoginResponseDTO(
        String token,
        Long expiresIn,
        String userName,
        String userRole // ADMIN ou CLIENTE
) {}
