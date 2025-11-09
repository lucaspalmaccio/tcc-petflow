package br.com.petflow.service;

import br.com.petflow.security.JwtUtil;
import br.com.petflow.dto.LoginRequestDTO;
import br.com.petflow.dto.LoginResponseDTO;
import br.com.petflow.model.Usuario;
import br.com.petflow.repository.UsuarioRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
     * Login com senha HASH (Seguro)
     */
    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        System.out.println("=== LOGIN DEBUG ===");
        System.out.println("Email recebido: " + loginRequest.email());
        System.out.println("Senha recebida (length): " + loginRequest.senha().length());

        try {
            // Busca o usuário
            Usuario usuario = usuarioRepository.findByEmail(loginRequest.email())
                    .orElseThrow(() -> {
                        System.out.println("❌ Usuário não encontrado!");
                        return new BadCredentialsException("Credenciais inválidas");
                    });

            System.out.println("✅ Usuário encontrado: " + usuario.getEmail());
            System.out.println("Perfil: " + usuario.getPerfil());
            System.out.println("Senha hash no banco começa com: " + usuario.getSenha().substring(0, 10));

            // Autentica usando o AuthenticationManager (valida a senha automaticamente)
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.email(),
                            loginRequest.senha()
                    )
            );

            System.out.println("✅ Autenticação bem-sucedida!");

            // Gera o token JWT
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtil.generateToken(userDetails);
            System.out.println("✅ Token JWT gerado!");
            System.out.println("=== FIM LOGIN DEBUG ===");

            return new LoginResponseDTO(
                    token,
                    86400000L, // 24 horas em milissegundos (deve corresponder ao jwt.expiration.ms)
                    usuario.getEmail(),
                    usuario.getPerfil().name()
            );

        } catch (BadCredentialsException e) {
            System.out.println("❌ SENHA INCORRETA ou USUÁRIO INVÁLIDO!");
            System.out.println("=== FIM LOGIN DEBUG ===");
            throw new RuntimeException("Credenciais inválidas");
        } catch (Exception e) {
            System.out.println("❌ ERRO INESPERADO: " + e.getMessage());
            e.printStackTrace();
            System.out.println("=== FIM LOGIN DEBUG ===");
            throw new RuntimeException("Erro ao realizar login: " + e.getMessage());
        }
    }

    /**
     * Método antigo - mantido para compatibilidade
     * @deprecated Use login(LoginRequestDTO) instead
     */
    @Deprecated
    public Usuario autenticar(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário ou senha inválidos"));

        if (!passwordEncoder.matches(senha, usuario.getSenha())) {
            throw new RuntimeException("Usuário ou senha inválidos");
        }

        return usuario;
    }
}