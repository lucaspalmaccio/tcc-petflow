// br.com.petflow.controller.AuthController.java
package br.com.petflow.controller;

import br.com.petflow.dto.LoginRequestDTO;
import br.com.petflow.dto.LoginResponseDTO;
import br.com.petflow.model.Usuario;
import br.com.petflow.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> autenticar(@RequestBody LoginRequestDTO loginRequest) {
        try {
            // ✅ Ajustei para usar senhaNormal
            Usuario usuario = authService.autenticar(loginRequest.email(), loginRequest.senha_normal());

            LoginResponseDTO response = new LoginResponseDTO(
                    "fake-jwt-token", // token JWT (pode gerar um real depois)
                    3600L, // 1 hora de expiração
                    usuario.getNome(),
                    usuario.getPerfil().name() // ✅ Retorna "ADMIN" ou "CLIENTE"
            );

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
    }
}
