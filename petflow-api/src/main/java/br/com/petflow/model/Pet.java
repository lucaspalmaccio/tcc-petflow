package br.com.petflow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// === INÍCIO DA CORREÇÃO ===
// Adiciona os imports que estavam faltando para List e ArrayList
import java.util.List;
import java.util.ArrayList;
// === FIM DA CORREÇÃO ===

@Entity
@Table(name = "pets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; //

    @Column(nullable = false)
    private String nome; //

    @Column(nullable = false, length = 100)
    private String especie; //

    @Column(nullable = false, length = 100)
    private String raca; //

    // Relacionamento com Cliente (Muitos pets pertencem a um cliente)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    // Relacionamento com Agendamento (Um pet tem muitos agendamentos)
    @OneToMany(mappedBy = "pet", fetch = FetchType.LAZY)
    private List<Agendamento> agendamentos = new ArrayList<>();
}
