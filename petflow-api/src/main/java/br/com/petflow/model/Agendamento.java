package br.com.petflow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "agendamentos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // [cite: 252-256]

    @Column(nullable = false)
    private LocalDateTime dataHora; // [cite: 257-260]

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private StatusAgendamento status; // [cite: 261-264, 299]

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorTotal; // [cite: 266-269]

    // --- Relacionamentos ---

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente; // [cite: 270-273]

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet; // [cite: 274-278]

    /**
     * Relacionamento Muitos-para-Muitos com Servico.
     * A tabela 'agendamento_servicos' [cite: 279] é gerenciada pelo JPA.
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "agendamento_servicos",
            joinColumns = @JoinColumn(name = "agendamento_id"), // [cite: 280]
            inverseJoinColumns = @JoinColumn(name = "servico_id") // [cite: 284]
    )
    private Set<Servico> servicos = new HashSet<>();
}