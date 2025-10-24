package br.com.petflow.repository;

import br.com.petflow.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    /**
     * Verifica se já existe um produto com este nome.
     * Usado na validação do UC04.
     */
    boolean existsByNome(String nome);
}