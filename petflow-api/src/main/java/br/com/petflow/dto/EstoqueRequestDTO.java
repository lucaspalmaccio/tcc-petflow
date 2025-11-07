package br.com.petflow.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * DTO para a requisição de entrada manual de estoque (CT04.2).
 */
public record EstoqueRequestDTO(
        @NotNull(message = "A quantidade é obrigatória")
        @Min(value = 1, message = "A quantidade deve ser de no mínimo 1")
        Integer quantidade
) {}