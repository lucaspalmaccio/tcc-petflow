package br.com.petflow.repository;

import br.com.petflow.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Busca um usuário pelo e-mail (usado para o login).
     * Conforme fluxo UC01[cite: 119].
     */
    Optional<UserDetails> findByEmail(String email);

    /**
     * Verifica se já existe um usuário com este e-mail.
     * Usado na validação do UC02[cite: 130].
     */
    boolean existsByEmail(String email);
}