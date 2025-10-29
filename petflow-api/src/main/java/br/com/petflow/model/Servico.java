package br.com.petflow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
// === INÍCIO DA CORREÇÃO ===
// Adiciona os imports que estavam faltando para Set e HashSet
import java.util.Set;
import java.util.HashSet;
// === FIM DA CORREÇÃO ===

@Entity
@Table(name = "servicos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // [cite: 205-208]

    @Column(nullable = false, unique = true)
    private String nome; // [cite: 209-212]

    @Column(columnDefinition = "TEXT")
    private String descricao; // [cite: 213-217]

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco; // [cite: 218-221]

    // Relacionamento com Agendamento (Um serviço está em muitos agendamentos)
    @ManyToMany(mappedBy = "servicos", fetch = FetchType.LAZY)
    private Set<Agendamento> agendamentos = new HashSet<>();
}
