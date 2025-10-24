package br.com.petflow.dto;

/**
 * DTO para enviar o token JWT após o login bem-sucedido.
 * Conforme Pós-condição (Sucesso): "O usuário tem uma sessão ativa".
 */
public record LoginResponseDTO(
        String token,
        Long expiresIn, // Informa ao front-end quando o token expira
        String userName,
        String userRole
) {}