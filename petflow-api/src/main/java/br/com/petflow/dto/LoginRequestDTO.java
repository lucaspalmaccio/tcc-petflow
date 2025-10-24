package br.com.petflow.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO para receber as credenciais de login (UC01).
 * Conforme Fluxo Principal: "O usuário informa seu e-mail e senha".
 */
public record LoginRequestDTO(
        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "Formato de e-mail inválido")
        String email,

        @NotBlank(message = "A senha é obrigatória")
        String senha
) {}