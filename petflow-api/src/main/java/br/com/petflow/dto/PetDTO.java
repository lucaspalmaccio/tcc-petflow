package br.com.petflow.dto;

import br.com.petflow.model.Pet;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO para criar, atualizar e exibir Pets (UC03).
 */
public record PetDTO(
        Long id,

        @NotBlank(message = "O nome do pet é obrigatório")
        String nome,

        @NotBlank(message = "A espécie é obrigatória")
        String especie,

        @NotBlank(message = "A raça é obrigatória")
        String raca,

        @NotNull(message = "O ID do cliente é obrigatório")
        Long clienteId
) {
    /**
     * Construtor para converter uma Entidade Pet em um PetDTO.
     */
    public PetDTO(Pet pet) {
        this(
                pet.getId(),
                pet.getNome(),
                pet.getEspecie(),
                pet.getRaca(),
                pet.getCliente().getId()
        );
    }
}