package br.com.petflow.dto;

import br.com.petflow.model.Agendamento;
import br.com.petflow.model.StatusAgendamento;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections; // Importe este
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
     * ATUALIZADO: Agora é "à prova de falhas" (Null-safe).
     */
    public AgendamentoResponseDTO(Agendamento agendamento) {
        this(
                agendamento.getId(),
                agendamento.getDataHora(),
                agendamento.getStatus(),
                agendamento.getValorTotal(),

                // Checa se o Cliente e o Usuário existem
                (agendamento.getCliente() != null && agendamento.getCliente().getUsuario() != null) ?
                        new ClienteInfo(
                                agendamento.getCliente().getId(),
                                agendamento.getCliente().getUsuario().getNome()
                        ) : new ClienteInfo(null, "Cliente Deletado"), // Fallback

                // Checa se o Pet existe
                (agendamento.getPet() != null) ?
                        new PetInfo(
                                agendamento.getPet().getId(),
                                agendamento.getPet().getNome()
                        ) : new PetInfo(null, "Pet Deletado"), // Fallback

                // Checa se a lista de Serviços existe
                (agendamento.getServicos() != null) ?
                        agendamento.getServicos().stream()
                                .map(s -> new ServicoInfo(s.getId(), s.getNome(), s.getPreco()))
                                .collect(Collectors.toList())
                        : Collections.emptyList() // Fallback
        );
    }
}