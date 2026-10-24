package br.com.petflow.evento;

import java.time.LocalDateTime;

/**
 * GoF Observer: evento publicado quando um agendamento é concluído.
 */
public record AgendamentoConcluidoEvent(
        Long agendamentoId,
        String emailCliente,
        String nomePet,
        LocalDateTime dataHora
) {
}
