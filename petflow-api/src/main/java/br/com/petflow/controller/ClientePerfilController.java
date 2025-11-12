package br.com.petflow.controller;

import br.com.petflow.dto.ClienteDTO;
import br.com.petflow.dto.PetDTO;
import br.com.petflow.dto.AlterarSenhaDTO;
import br.com.petflow.dto.AgendamentoResponseDTO;
import br.com.petflow.service.ClientePerfilService;
import br.com.petflow.service.PetService;
import br.com.petflow.service.AgendamentoService;
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

    @Autowired
    private AgendamentoService agendamentoService;

    /**
     * Cliente busca seus próprios dados
     */
    @GetMapping
    public ResponseEntity<ClienteDTO> buscarMeuPerfil(
            @AuthenticationPrincipal UserDetails userDetails) {
        ClienteDTO clienteDTO = clientePerfilService.buscarPerfilCliente(userDetails);
        return ResponseEntity.ok(clienteDTO);
    }

    /**
     * Cliente atualiza seus próprios dados
     */
    @PutMapping
    public ResponseEntity<ClienteDTO> atualizarMeuPerfil(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid ClienteDTO clienteDTO) {
        ClienteDTO atualizado = clientePerfilService.atualizarPerfilCliente(userDetails, clienteDTO);
        return ResponseEntity.ok(atualizado);
    }

    /**
     * Cliente altera sua senha
     */
    @PutMapping("/senha")
    public ResponseEntity<Void> alterarMinhaSenha(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid AlterarSenhaDTO alterarSenhaDTO) {
        clientePerfilService.alterarSenha(userDetails, alterarSenhaDTO);
        return ResponseEntity.noContent().build();
    }

    /**
     * Cliente cria seus próprios pets
     */
    @PostMapping("/pets")
    public ResponseEntity<PetDTO> criarMeuPet(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid PetDTO petDTO) {
        PetDTO novoPet = petService.criarPetParaCliente(userDetails, petDTO);
        return new ResponseEntity<>(novoPet, HttpStatus.CREATED);
    }

    /**
     * Cliente edita seus pets
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
     * Cliente deleta seus pets
     */
    @DeleteMapping("/pets/{id}")
    public ResponseEntity<Void> deletarMeuPet(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        petService.deletarPetDoCliente(userDetails, id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Listar pets do cliente
     */
    @GetMapping("/pets")
    public ResponseEntity<List<PetDTO>> listarMeusPets(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(petService.listarMeusPets(userDetails));
    }

    /**
     * ✨ Cliente lista seus próprios agendamentos ✨
     */
    @GetMapping("/agendamentos")
    public ResponseEntity<List<AgendamentoResponseDTO>> listarMeusAgendamentos(
            @AuthenticationPrincipal UserDetails userDetails) {

        String emailCliente = userDetails.getUsername();

        System.out.println("========================================");
        System.out.println("🔍 LISTANDO AGENDAMENTOS DO CLIENTE");
        System.out.println("📧 Email: " + emailCliente);
        System.out.println("🔑 Authorities: " + userDetails.getAuthorities());
        System.out.println("========================================");

        List<AgendamentoResponseDTO> agendamentos = agendamentoService.listarAgendamentosDoCliente(emailCliente);

        System.out.println("📊 Total de agendamentos encontrados: " + agendamentos.size());

        if (agendamentos.isEmpty()) {
            System.out.println("⚠️ Nenhum agendamento encontrado para este cliente!");
        } else {
            System.out.println("✅ Agendamentos carregados com sucesso:");
            agendamentos.forEach(ag ->
                    System.out.println("   - ID: " + ag.id() + " | Data: " + ag.dataHora() + " | Status: " + ag.status())
            );
        }

        System.out.println("========================================\n");

        return ResponseEntity.ok(agendamentos);
    }
}