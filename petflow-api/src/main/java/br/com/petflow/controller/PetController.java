package br.com.petflow.controller;

import br.com.petflow.dto.PetDTO;
import br.com.petflow.service.PetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
public class PetController {

    @Autowired
    private PetService petService;

    // === INÍCIO DA ATUALIZAÇÃO SPRINT 03 ===
    /**
     * Endpoint para o CLIENTE logado buscar seus próprios pets.
     * (Fluxo UC05 - "permite a seleção de um de seus Pets cadastrados")
     */
    @GetMapping("/meus-pets")
    public ResponseEntity<List<PetDTO>> listarMeusPets(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(petService.listarMeusPets(userDetails));
    }
    // === FIM DA ATUALIZAÇÃO SPRINT 03 ===

    /**
     * UC03 - Adicionar Pet (Apenas Admin)
     */
    @PostMapping
    public ResponseEntity<PetDTO> criarPet(@RequestBody @Valid PetDTO petDTO) {
        PetDTO novoPet = petService.criarPet(petDTO);
        return new ResponseEntity<>(novoPet, HttpStatus.CREATED);
    }

    /**
     * UC03 - Listar Pets (Apenas Admin)
     */
    @GetMapping
    public ResponseEntity<List<PetDTO>> listarPets() {
        return ResponseEntity.ok(petService.listarTodos());
    }

    /**
     * UC03 - Buscar Pet por ID (Apenas Admin)
     */
    @GetMapping("/{id}")
    public ResponseEntity<PetDTO> buscarPetPorId(@PathVariable Long id) {
        return ResponseEntity.ok(petService.buscarPorId(id));
    }

    /**
     * UC03 - Atualizar Pet (Apenas Admin)
     */
    @PutMapping("/{id}")
    public ResponseEntity<PetDTO> atualizarPet(@PathVariable Long id, @RequestBody @Valid PetDTO petDTO) {
        return ResponseEntity.ok(petService.atualizarPet(id, petDTO));
    }

    /**
     * UC03 - Excluir Pet (Apenas Admin)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPet(@PathVariable Long id) {
        petService.deletarPet(id);
        return ResponseEntity.noContent().build();
    }
}
