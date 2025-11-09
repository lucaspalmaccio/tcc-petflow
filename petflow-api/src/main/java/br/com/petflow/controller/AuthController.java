package br.com.petflow.controller;

import br.com.petflow.dto.LoginRequestDTO;
import br.com.petflow.dto.LoginResponseDTO;
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
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
        try {
            // ✅ CORREÇÃO: Chama o método login() que gera o JWT!
            LoginResponseDTO response = authService.login(loginRequest);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            // Log do erro para debug
            System.err.println("❌ Erro no login: " + e.getMessage());
            return ResponseEntity.status(401).body(null);
        }
    }
}