package br.com.petflow.controller;

import br.com.petflow.dto.LoginRequestDTO;
import br.com.petflow.dto.LoginResponseDTO;
import br.com.petflow.model.Usuario;
import br.com.petflow.service.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    /**
     * UC01 - Autenticar Usuário (Fluxo Principal)
     */
    @PostMapping("/login")
    public ResponseEntity<?> autenticar(@RequestBody @Valid LoginRequestDTO loginRequest) {
        // Fluxo UC01 [119]: O sistema verifica as credenciais
        var usernamePassword = new UsernamePasswordAuthenticationToken(
                loginRequest.email(),
                loginRequest.senha()
        );

        Authentication authentication = authenticationManager.authenticate(usernamePassword);

        // Fluxo UC01 [120]: O sistema cria uma sessão (Token)
        String token = tokenService.generateToken(authentication);

        // Pós-condição UC01 [115]: Retorna o token e dados do usuário
        Usuario usuario = (Usuario) authentication.getPrincipal();
        String role = usuario.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_CLIENTE");

        return ResponseEntity.ok(new LoginResponseDTO(
                token,
                tokenService.getJwtExpirationMs(),
                usuario.getNome(),
                role
        ));
    }
}