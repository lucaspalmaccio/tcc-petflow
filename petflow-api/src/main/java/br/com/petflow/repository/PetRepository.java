package br.com.petflow.repository;

import br.com.petflow.model.Cliente;
import br.com.petflow.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PetRepository extends JpaRepository<Pet, Long> {

    /**
     * Busca todos os pets de um cliente específico.
     * Usado em `listarMeusPets` (UC05).
     */
    List<Pet> findAllByCliente(Cliente cliente);
}
