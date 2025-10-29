package br.com.petflow.service;

import br.com.petflow.model.Usuario;
import br.com.petflow.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Autentica o usuário usando e-mail e senha_normal (texto puro).
     * TODO: Na última sprint, trocar para validar com BCrypt usando getSenha()
     */
    public Usuario autenticar(String email, String senha_normal) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // ✅ Valida com senha_normal (texto puro) por enquanto
        if (!senha_normal.equals(usuario.getSenhaNormal())) {
            throw new RuntimeException("Senha inválida");
        }

        // TODO: Na última sprint, usar:
        // if (!passwordEncoder.matches(senha_normal, usuario.getSenha())) {
        //     throw new RuntimeException("Senha inválida");
        // }

        return usuario;
    }
}