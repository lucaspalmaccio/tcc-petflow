package br.com.petflow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // [cite: 82]

    @Column(nullable = false)
    private String nome; // [cite: 83]

    @Column(nullable = false, length = 100)
    private String especie; // [cite: 84]

    @Column(nullable = false, length = 100)
    private String raca; // [cite: 85]

    // Relacionamento com Cliente (Muitos pets pertencem a um cliente) [cite: 86, 87]
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    // Relacionamento com Agendamento (Um pet tem muitos agendamentos)
    @OneToMany(mappedBy = "pet", fetch = FetchType.LAZY)
    private List<Agendamento> agendamentos = new ArrayList<>();
}