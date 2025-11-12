package br.com.petflow.repository;
import java.util.Optional;
import br.com.petflow.model.Cliente;
import br.com.petflow.model.Usuario;  // ← ADICIONE ESTA LINHA
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    /**
     * Verifica se já existe um cliente com este CPF.
     * Usado na validação do UC02.
     */
    Optional<Cliente> findByUsuario(Usuario usuario);
    boolean existsByCpf(String cpf);
}