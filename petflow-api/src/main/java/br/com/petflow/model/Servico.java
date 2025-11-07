package br.com.petflow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name = "servicos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    @ManyToMany(mappedBy = "servicos", fetch = FetchType.LAZY)
    private Set<Agendamento> agendamentos = new HashSet<>();

    // === INÍCIO DA ATUALIZAÇÃO SPRINT 4 ===
    /**
     * Define quais produtos (e a quantidade) este serviço utiliza.
     */
    @OneToMany(
            mappedBy = "servico",
            cascade = CascadeType.ALL, // Gerencia a vida da entidade de ligação
            orphanRemoval = true,
            fetch = FetchType.LAZY // Carrega apenas quando necessário
    )
    private Set<ServicoProduto> produtosUsados = new HashSet<>();
    // === FIM DA ATUALIZAÇÃO SPRINT 4 ===
}