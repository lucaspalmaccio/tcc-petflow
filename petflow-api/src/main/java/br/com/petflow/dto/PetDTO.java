package br.com.petflow.dto;

import br.com.petflow.model.Pet;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO para criar, atualizar e exibir Pets (UC03).
 * O clienteId é opcional porque quando o cliente cria seu próprio pet,
 * o backend já sabe quem é o cliente autenticado.
 */
public record PetDTO(
        Long id,

        @NotBlank(message = "O nome do pet é obrigatório")
        String nome,

        @NotBlank(message = "A espécie é obrigatória")
        String especie,

        @NotBlank(message = "A raça é obrigatória")
        String raca,

        // Removido @NotNull - agora é opcional
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
                pet.getCliente() != null ? pet.getCliente().getId() : null
        );
    }
}