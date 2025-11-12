package br.com.petflow.service;

import br.com.petflow.security.JwtUtil;
import br.com.petflow.dto.LoginRequestDTO;
import br.com.petflow.dto.LoginResponseDTO;
import br.com.petflow.model.Usuario;
import br.com.petflow.repository.UsuarioRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            AuthenticationManager authenticationManager
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    /**
     * TESTE AUTOMÁTICO AO INICIAR A APLICAÇÃO
     */
    @PostConstruct
    public void gerarHashDefinitivo() {
        System.out.println("\n" + "=".repeat(60));
        System.out.println("🔐 GERANDO HASH BCRYPT DEFINITIVO");
        System.out.println("=".repeat(60));

        String senhaTexto = "123456";

        // Gera 3 hashes diferentes para testar
        for (int i = 1; i <= 3; i++) {
            String hash = passwordEncoder.encode(senhaTexto);
            boolean valido = passwordEncoder.matches(senhaTexto, hash);

            System.out.println("\nHash #" + i + ":");
            System.out.println("  " + hash);
            System.out.println("  Válido? " + valido);
        }

        //System.out.println("\n📋 ESCOLHA UM DOS HASHES ACIMA E EXECUTE:");
        //System.out.println("UPDATE usuarios SET senha = 'COLE_O_HASH_AQUI'");
        //System.out.println("WHERE email = 'admin@petflow.com';");
        //System.out.println("=".repeat(60) + "\n");
    }


    /**
     * Login com autenticação via Spring Security
     */
    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        System.out.println("\n=== INÍCIO LOGIN ===");
        System.out.println("📧 Email: " + loginRequest.email());

        try {
            Usuario usuario = usuarioRepository.findByEmail(loginRequest.email())
                    .orElseThrow(() -> new BadCredentialsException("Credenciais inválidas"));

            System.out.println("✅ Usuário encontrado: " + usuario.getEmail());
            System.out.println("✅ Perfil: " + usuario.getPerfil());

            // Autentica
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.email(),
                            loginRequest.senha()
                    )
            );

            System.out.println("✅ Autenticação bem-sucedida!");

            // Gera o token
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtil.generateToken(userDetails);

            //System.out.println("✅ Token gerado!");
            System.out.println("=== FIM LOGIN ===\n");

            // ✅ RETORNA COM EMAIL
            return new LoginResponseDTO(
                    token,
                    86400000L,
                    usuario.getEmail(),  // ✅ ADICIONE ESTE CAMPO
                    usuario.getPerfil().name()
            );

        } catch (BadCredentialsException e) {
            System.err.println("❌ SENHA INCORRETA!");
            System.err.println("=== FIM LOGIN ===\n");
            throw new RuntimeException("Credenciais inválidas");
        }
    }
}