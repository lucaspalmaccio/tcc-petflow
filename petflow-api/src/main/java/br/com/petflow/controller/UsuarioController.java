package br.com.petflow.controller;

import br.com.petflow.model.PerfilUsuario;
import br.com.petflow.dto.NovoUsuarioDTO;
import br.com.petflow.model.Usuario;
import br.com.petflow.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastrarAdmin(@RequestBody NovoUsuarioDTO dto) {
        if (usuarioRepository.existsByEmail(dto.email())) {
            return ResponseEntity.badRequest().body("E-mail já cadastrado!");
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(dto.nome());
        novoUsuario.setEmail(dto.email());
        novoUsuario.setSenha(passwordEncoder.encode(dto.senha_normal())); // senha_normal usada
        novoUsuario.setPerfil(PerfilUsuario.valueOf(dto.perfil().toUpperCase())); // ADMIN ou CLIENTE

        usuarioRepository.save(novoUsuario);
        return ResponseEntity.ok("Usuário cadastrado com sucesso!");
    }
}
