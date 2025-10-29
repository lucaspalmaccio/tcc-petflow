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

@RestController
@RequestMapping("/api/agendamentos")
public class AgendamentoController {

    private final AgendamentoService agendamentoService;

    public AgendamentoController(AgendamentoService agendamentoService) {
        this.agendamentoService = agendamentoService;
    }

    /**
     * 🟢 Criar um novo agendamento (somente CLIENTE autenticado)
     */
    @PostMapping
    public ResponseEntity<AgendamentoResponseDTO> criarAgendamento(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid AgendamentoRequestDTO dto) {

        String emailUsuario = userDetails.getUsername();

        AgendamentoResponseDTO criado = agendamentoService.criarAgendamento(dto, emailUsuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    /**
     * 🟡 Listar todos os agendamentos do cliente logado
     */
    @GetMapping
    public ResponseEntity<List<AgendamentoResponseDTO>> listarMeusAgendamentos(
            @AuthenticationPrincipal UserDetails userDetails) {

        String emailUsuario = userDetails.getUsername();

        List<AgendamentoResponseDTO> agendamentos =
                agendamentoService.listarAgendamentosDoCliente(emailUsuario);

        return ResponseEntity.ok(agendamentos);
    }

    /**
     * 🔴 Cancelar um agendamento do cliente logado
     */
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<AgendamentoResponseDTO> cancelarAgendamento(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        String emailUsuario = userDetails.getUsername();

        AgendamentoResponseDTO cancelado =
                agendamentoService.cancelarAgendamento(id, emailUsuario);

        return ResponseEntity.ok(cancelado);
    }
}
