package br.com.petflow.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "servico_produtos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServicoProduto {

    @EmbeddedId
    private ServicoProdutoId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("servicoId") // Mapeia a parte 'servicoId' do @EmbeddedId
    @JoinColumn(name = "servico_id")
    private Servico servico;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("produtoId") // Mapeia a parte 'produtoId' do @EmbeddedId
    @JoinColumn(name = "produto_id")
    private Produto produto;

    @Column(nullable = false)
    private Integer quantidade; // A quantidade de produto que este serviço usa
}