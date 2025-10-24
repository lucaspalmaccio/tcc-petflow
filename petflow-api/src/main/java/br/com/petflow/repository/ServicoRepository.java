package br.com.petflow.repository;

import br.com.petflow.model.Servico;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServicoRepository extends JpaRepository<Servico, Long> {

    /**
     * Verifica se já existe um serviço com este nome.
     * Usado na validação do UC04.
     */
    boolean existsByNome(String nome);
}