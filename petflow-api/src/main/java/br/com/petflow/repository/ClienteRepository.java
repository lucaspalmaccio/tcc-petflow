package br.com.petflow.repository;

import br.com.petflow.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    /**
     * Verifica se já existe um cliente com este CPF.
     * Usado na validação do UC02[cite: 130].
     */
    boolean existsByCpf(String cpf);
}