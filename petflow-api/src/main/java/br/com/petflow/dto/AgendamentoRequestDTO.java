package br.com.petflow.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para a requisição de criação de um novo agendamento (UC05).
 */
public record AgendamentoRequestDTO(
        /**
         * ID do Cliente. Obrigatório se o ator for ADMIN.
         * Ignorado se o ator for CLIENTE (será pego da autenticação).
         */
        Long clienteId,

        @NotNull(message = "O ID do Pet é obrigatório")
        Long petId,

        @NotNull(message = "A data/hora é obrigatória")
        @Future(message = "A data do agendamento deve ser no futuro")
        LocalDateTime dataHora,

        @NotEmpty(message = "Pelo menos um serviço deve ser selecionado")
        List<Long> servicoIds
) {}