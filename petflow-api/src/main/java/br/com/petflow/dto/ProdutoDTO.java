package br.com.petflow.dto;

import br.com.petflow.model.Produto;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

/**
 * DTO para criar, atualizar e exibir Produtos (UC04).
 * Baseado na entidade Produto [cite: 70, 222-251].
 */
public record ProdutoDTO(
        Long id,

        @NotBlank(message = "O nome do produto é obrigatório")
        String nome,

        String descricao,

        @NotNull(message = "O preço de custo é obrigatório")
        @DecimalMin(value = "0.00", message = "O preço de custo não pode ser negativo")
        BigDecimal precoCusto,

        @NotNull(message = "O preço de venda é obrigatório")
        @DecimalMin(value = "0.01", message = "O preço de venda deve ser positivo")
        BigDecimal precoVenda,

        @NotNull(message = "A quantidade em estoque é obrigatória")
        @Min(value = 0, message = "O estoque não pode ser negativo")
        Integer qtdEstoque
) {
    /**
     * Construtor para converter uma Entidade Produto em um ProdutoDTO.
     */
    public ProdutoDTO(Produto produto) {
        this(
                produto.getId(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getPrecoCusto(),
                produto.getPrecoVenda(),
                produto.getQtdEstoque()
        );
    }
}