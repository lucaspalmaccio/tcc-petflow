package br.com.petflow.model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ServicoProdutoId implements Serializable {

    private Long servicoId;
    private Long produtoId;

    // --- Construtores, Getters, Setters, hashCode e equals ---
    // (Obrigatórios para chaves compostas)

    public ServicoProdutoId() {
    }

    public ServicoProdutoId(Long servicoId, Long produtoId) {
        this.servicoId = servicoId;
        this.produtoId = produtoId;
    }

    // Getters e Setters
    public Long getServicoId() { return servicoId; }
    public void setServicoId(Long servicoId) { this.servicoId = servicoId; }
    public Long getProdutoId() { return produtoId; }
    public void setProdutoId(Long produtoId) { this.produtoId = produtoId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ServicoProdutoId that = (ServicoProdutoId) o;
        return Objects.equals(servicoId, that.servicoId) &&
                Objects.equals(produtoId, that.produtoId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(servicoId, produtoId);
    }
}