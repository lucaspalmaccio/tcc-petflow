package br.com.petflow.dto;

import br.com.petflow.model.Servico;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

/**
 * DTO para criar, atualizar e exibir Serviços (UC04).
 * Baseado na entidade Servico
 */
public record ServicoDTO(
        Long id,

        @NotBlank(message = "O nome do serviço é obrigatório")
        String nome,

        String descricao,

        @NotNull(message = "O preço é obrigatório")
        @DecimalMin(value = "0.01", message = "O preço deve ser positivo")
        BigDecimal preco
) {
    /**
     * Construtor para converter uma Entidade Servico em um ServicoDTO.
     */
    public ServicoDTO(Servico servico) {
        this(
                servico.getId(),
                servico.getNome(),
                servico.getDescricao(),
                servico.getPreco()
        );
    }
}