package br.com.petflow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clientes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // [cite: 76]

    @Column(nullable = false, unique = true, length = 11)
    private String cpf; // [cite: 77]

    @Column(nullable = false, length = 15)
    private String telefone; // [cite: 78]

    @Column(nullable = true)
    private String endereco; // [cite: 79]

    // Relacionamento com Usuario (para login) [cite: 80, 81]
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", nullable = false)
    private Usuario usuario;

    // Relacionamento com Pet (Um cliente tem muitos pets)
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pet> pets = new ArrayList<>();

    // Relacionamento com Agendamento (Um cliente tem muitos agendamentos)
    @OneToMany(mappedBy = "cliente", fetch = FetchType.LAZY)
    private List<Agendamento> agendamentos = new ArrayList<>();
}