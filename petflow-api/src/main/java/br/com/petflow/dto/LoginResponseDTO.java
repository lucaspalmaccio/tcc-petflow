package br.com.petflow.dto;

public record LoginResponseDTO(
        String token,
        Long expiresIn,
        String email,
        String perfil // ADMIN ou CLIENTE
) {}
