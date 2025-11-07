package br.com.petflow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
// === INÍCIO DA ATUALIZAÇÃO SPRINT 4 ===
import java.util.Set;
import java.util.HashSet;
// === FIM DA ATUALIZAÇÃO SPRINT 4 ===

@Entity
@Table(name = "produtos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precoCusto;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precoVenda;

    @Column(nullable = false)
    private Integer qtdEstoque;

    // === INÍCIO DA ATUALIZAÇÃO SPRINT 4 ===
    /**
     * Relacionamento inverso para integridade referencial.
     * Lista todos os "itens de serviço" que usam este produto.
     */
    @OneToMany(mappedBy = "produto", fetch = FetchType.LAZY)
    private Set<ServicoProduto> servicosQueUsam = new HashSet<>();
    // === FIM DA ATUALIZAÇÃO SPRINT 4 ===
}