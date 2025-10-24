package br.com.petflow.dto;

import br.com.petflow.model.Agendamento;
import br.com.petflow.model.StatusAgendamento;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * DTO para exibir agendamentos (listas, calendário).
 * Inclui dados aninhados para facilitar o front-end.
 */
public record AgendamentoResponseDTO(
        Long id,
        LocalDateTime dataHora,
        StatusAgendamento status,
        BigDecimal valorTotal,
        ClienteInfo cliente,
        PetInfo pet,
        List<ServicoInfo> servicos
) {
    // DTO aninhado para Cliente
    public record ClienteInfo(Long id, String nome) {}

    // DTO aninhado para Pet
    public record PetInfo(Long id, String nome) {}

    // DTO aninhado para Servico
    public record ServicoInfo(Long id, String nome, BigDecimal preco) {}

    /**
     * Construtor para converter a Entidade Agendamento completa.
     */
    public AgendamentoResponseDTO(Agendamento agendamento) {
        this(
                agendamento.getId(),
                agendamento.getDataHora(),
                agendamento.getStatus(),
                agendamento.getValorTotal(),
                new ClienteInfo(
                        agendamento.getCliente().getId(),
                        agendamento.getCliente().getUsuario().getNome() // Pega o nome do Usuario
                ),
                new PetInfo(
                        agendamento.getPet().getId(),
                        agendamento.getPet().getNome()
                ),
                agendamento.getServicos().stream()
                        .map(s -> new ServicoInfo(s.getId(), s.getNome(), s.getPreco()))
                        .collect(Collectors.toList())
        );
    }
}