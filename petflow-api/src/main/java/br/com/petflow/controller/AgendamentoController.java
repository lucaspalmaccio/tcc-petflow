package br.com.petflow.controller;

import br.com.petflow.dto.AgendamentoRequestDTO;
import br.com.petflow.dto.AgendamentoResponseDTO;
import br.com.petflow.service.AgendamentoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// === INÍCIO ATUALIZAÇÃO ADMIN ===
import java.time.LocalDateTime; // Para os RequestParams
import br.com.petflow.model.PerfilUsuario; // Para checar o perfil
// === FIM ATUALIZAÇÃO ADMIN ===

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;


@RestController
@RequestMapping("/api/agendamentos")
@Tag(name = "Agendamentos", description = "Endpoints para Clientes e Administradores gerenciarem agendamentos")
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    public AgendamentoController(AgendamentoService agendamentoService) {
        this.agendamentoService = agendamentoService;
    }

    /**
     * 🟢 Criar um novo agendamento (CLIENTE ou ADMIN)
     * ATUALIZADO: O service vai tratar a lógica de perfil.
     */
    @PostMapping
    @Operation(summary = "Cria um novo agendamento (Cliente ou Admin)")
    @ApiResponse(responseCode = "201", description = "Agendamento criado com sucesso")
    @SecurityRequirement(name = "bearer-key") // Protegido por JWT
    public ResponseEntity<AgendamentoResponseDTO> criarAgendamento(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid AgendamentoRequestDTO dto) {

        String emailUsuario = userDetails.getUsername();

        // O Service (criarAgendamento) agora contém a lógica para
        // diferenciar ADMIN (usando dto.clienteId) de CLIENTE (usando emailUsuario)
        AgendamentoResponseDTO criado = agendamentoService.criarAgendamento(dto, emailUsuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    /**
     * 🟡 Listar agendamentos (CLIENTE ou ADMIN)
     * ATUALIZADO: Retorna TODOS se for ADMIN (para o calendário)
     * ou SÓ OS DO CLIENTE se for CLIENTE.
     */
    @GetMapping
    @Operation(summary = "Lista agendamentos (Admin ou Cliente)",
            description = "Se o usuário for ADMIN, retorna todos os agendamentos (pode usar 'inicio' e 'fim'). " +
                    "Se for CLIENTE, retorna apenas os seus próprios agendamentos.")
    @ApiResponse(responseCode = "200", description = "Lista de agendamentos retornada")
    @SecurityRequirement(name = "bearer-key")
    public ResponseEntity<List<AgendamentoResponseDTO>> listarAgendamentos(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) LocalDateTime inicio,
            @RequestParam(required = false) LocalDateTime fim) {

        String emailUsuario = userDetails.getUsername();

        // Verifica se o usuário tem a ROLE_ADMIN
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        List<AgendamentoResponseDTO> agendamentos;

        if (isAdmin) {
            // ADMIN: Retorna todos os agendamentos (para o calendário)
            agendamentos = agendamentoService.listarAgendamentos(inicio, fim);
        } else {
            // CLIENTE: Retorna apenas os agendamentos do cliente logado
            agendamentos = agendamentoService.listarAgendamentosDoCliente(emailUsuario);
        }

        return ResponseEntity.ok(agendamentos);
    }

    /**
     * 🔴 Cancelar um agendamento (CLIENTE ou ADMIN)
     * ATUALIZADO: O service vai tratar a lógica de perfil.
     */
    @PatchMapping("/{id}/cancelar")
    @Operation(summary = "Cancela um agendamento (Cliente ou Admin)")
    @ApiResponse(responseCode = "200", description = "Agendamento cancelado com sucesso")
    @SecurityRequirement(name = "bearer-key")
    public ResponseEntity<AgendamentoResponseDTO> cancelarAgendamento(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        String emailUsuario = userDetails.getUsername();

        // O Service (cancelarAgendamento) agora contém a lógica
        // para permitir que o ADMIN cancele qualquer agendamento
        AgendamentoResponseDTO cancelado =
                agendamentoService.cancelarAgendamento(id, emailUsuario);

        return ResponseEntity.ok(cancelado);
    }

    /**
     * ⚪ Concluir um agendamento (somente ADMIN)
     * (Método original - sem alteração)
     */
    @PatchMapping("/{id}/concluir")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearer-key")
    @Operation(
            summary = "Marca um agendamento como 'CONCLUÍDO' (Admin)",
            description = "Altera o status de um agendamento para CONCLUÍDO e " +
                    "dispara a lógica de baixa automática de estoque.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Agendamento concluído com sucesso"),
                    @ApiResponse(responseCode = "403", description = "Acesso negado (Usuário não é ADMIN)"),
                    @ApiResponse(responseCode = "404", description = "Agendamento não encontrado"),
                    @ApiResponse(responseCode = "400", description = "Agendamento já concluído ou cancelado")
            }
    )
    public ResponseEntity<AgendamentoResponseDTO> concluirAgendamento(@PathVariable Long id) {
        AgendamentoResponseDTO agendamentoAtualizado = agendamentoService.concluirAgendamento(id);
        return ResponseEntity.ok(agendamentoAtualizado);
    }
}