package br.com.petflow.config;

import br.com.petflow.model.PerfilUsuario;
import br.com.petflow.model.Usuario;
import br.com.petflow.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner criarAdminPadrao(UsuarioRepository usuarioRepository,
                                              PasswordEncoder passwordEncoder) {
        return args -> {
            String emailAdmin = "admin@petflow.com";

            if (usuarioRepository.findByEmail(emailAdmin).isEmpty()) {
                Usuario admin = new Usuario();
                admin.setNome("Administrador");
                admin.setEmail(emailAdmin);
                admin.setSenha(passwordEncoder.encode("123456"));
                admin.setPerfil(PerfilUsuario.ADMIN);
                usuarioRepository.save(admin);

                System.out.println("✅ Usuário admin criado: " + emailAdmin);
            }
        };
    }
}
