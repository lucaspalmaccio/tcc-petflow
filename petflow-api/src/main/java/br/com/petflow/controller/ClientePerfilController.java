package br.com.petflow.controller;

import br.com.petflow.dto.ClienteDTO;
import br.com.petflow.dto.PetDTO;
import br.com.petflow.dto.AlterarSenhaDTO;
import br.com.petflow.service.ClientePerfilService;
import br.com.petflow.service.PetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller para gerenciar o perfil do CLIENTE logado.
 * Todos os endpoints são acessíveis apenas para usuários com ROLE_CLIENTE.
 */
@RestController
@RequestMapping("/api/clientes/me")
public class ClientePerfilController {

    @Autowired
    private ClientePerfilService clientePerfilService;

    @Autowired
    private PetService petService;

    /**
     * 1. GET /api/clientes/me - Cliente busca seus próprios dados
     */
    @GetMapping
    public ResponseEntity<ClienteDTO> buscarMeuPerfil(
            @AuthenticationPrincipal UserDetails userDetails) {
        ClienteDTO clienteDTO = clientePerfilService.buscarPerfilCliente(userDetails);
        return ResponseEntity.ok(clienteDTO);
    }

    /**
     * 2. PUT /api/clientes/me - Cliente atualiza seus próprios dados
     */
    @PutMapping
    public ResponseEntity<ClienteDTO> atualizarMeuPerfil(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid ClienteDTO clienteDTO) {
        ClienteDTO atualizado = clientePerfilService.atualizarPerfilCliente(userDetails, clienteDTO);
        return ResponseEntity.ok(atualizado);
    }

    /**
     * 3. PUT /api/clientes/me/senha - Cliente altera sua senha
     */
    @PutMapping("/senha")
    public ResponseEntity<Void> alterarMinhaSenha(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid AlterarSenhaDTO alterarSenhaDTO) {
        clientePerfilService.alterarSenha(userDetails, alterarSenhaDTO);
        return ResponseEntity.noContent().build();
    }

    /**
     * 4. POST /api/clientes/me/pets - Cliente cria seus próprios pets
     */
    @PostMapping("/pets")
    public ResponseEntity<PetDTO> criarMeuPet(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid PetDTO petDTO) {
        PetDTO novoPet = petService.criarPetParaCliente(userDetails, petDTO);
        return new ResponseEntity<>(novoPet, HttpStatus.CREATED);
    }

    /**
     * 5. PUT /api/clientes/me/pets/{id} - Cliente edita seus pets
     */
    @PutMapping("/pets/{id}")
    public ResponseEntity<PetDTO> atualizarMeuPet(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody @Valid PetDTO petDTO) {
        PetDTO atualizado = petService.atualizarPetDoCliente(userDetails, id, petDTO);
        return ResponseEntity.ok(atualizado);
    }

    /**
     * 6. DELETE /api/clientes/me/pets/{id} - Cliente deleta seus pets
     */
    @DeleteMapping("/pets/{id}")
    public ResponseEntity<Void> deletarMeuPet(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        petService.deletarPetDoCliente(userDetails, id);
        return ResponseEntity.noContent().build();
    }

    /**
     * BÔNUS: GET /api/clientes/me/pets - Listar pets do cliente
     * (Já existe em PetController como /api/pets/meus-pets, mas pode duplicar aqui para consistência)
     */
    @GetMapping("/pets")
    public ResponseEntity<List<PetDTO>> listarMeusPets(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(petService.listarMeusPets(userDetails));
    }
}