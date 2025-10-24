package br.com.petflow.controller;

import br.com.petflow.dto.AgendamentoRequestDTO;
import br.com.petflow.dto.AgendamentoResponseDTO;
import br.com.petflow.service.AgendamentoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/agendamentos")
public class AgendamentoController {

    @Autowired
    private AgendamentoService agendamentoService;

    /**
     * UC05 - Realizar Agendamento (Atores: Admin ou Cliente)
     */
    @PostMapping
    public ResponseEntity<AgendamentoResponseDTO> criarAgendamento(
            @RequestBody @Valid AgendamentoRequestDTO agendamentoDTO,
            @AuthenticationPrincipal UserDetails userDetails) {

        AgendamentoResponseDTO novoAgendamento = agendamentoService.criarAgendamento(agendamentoDTO, userDetails);
        return new ResponseEntity<>(novoAgendamento, HttpStatus.CREATED);
    }

    /**
     * UC05 - Consultar Agenda (Admin) ou Meus Agendamentos (Cliente)
     */
    @GetMapping
    public ResponseEntity<List<AgendamentoResponseDTO>> listarAgendamentos(
            // Parâmetros para o Admin (Calendário)
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim,
            @AuthenticationPrincipal UserDetails userDetails) {

        // Se for admin e não passar data, define um padrão (ex: mês atual)
        if (inicio == null && fim == null) {
            inicio = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0);
            fim = LocalDateTime.now().plusMonths(1).withDayOfMonth(1).withHour(0).withMinute(0);
        }

        List<AgendamentoResponseDTO> agendamentos = agendamentoService.listarAgendamentos(inicio, fim, userDetails);
        return ResponseEntity.ok(agendamentos);
    }

    /**
     * CT03.4 - Cancelar Agendamento (Atores: Admin ou Cliente)
     */
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<AgendamentoResponseDTO> cancelarAgendamento(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        AgendamentoResponseDTO agendamentoCancelado = agendamentoService.cancelarAgendamento(id, userDetails);
        return ResponseEntity.ok(agendamentoCancelado);
    }
}