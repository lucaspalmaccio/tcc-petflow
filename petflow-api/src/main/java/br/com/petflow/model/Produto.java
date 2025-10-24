package br.com.petflow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "produtos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // [cite: 224-228]

    @Column(nullable = false, unique = true)
    private String nome; // [cite: 230-233]

    @Column(columnDefinition = "TEXT")
    private String descricao; // [cite: 236-239]

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precoCusto; // [cite: 240-243]

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precoVenda; // [cite: 244-247]

    @Column(nullable = false)
    private Integer qtdEstoque; // [cite: 248-251]
}