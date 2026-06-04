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
     * Login com autenticação via Spring Security
     */
    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        try {
            Usuario usuario = usuarioRepository.findByEmail(loginRequest.email())
                    .orElseThrow(() -> new BadCredentialsException("Credenciais inválidas"));

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.email(),
                            loginRequest.senha()
                    )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtil.generateToken(userDetails);

            return new LoginResponseDTO(
                    token,
                    86400000L,
                    usuario.getEmail(),
                    usuario.getPerfil().name()
            );

        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("E-mail ou senha inválidos.");
        }
    }
}