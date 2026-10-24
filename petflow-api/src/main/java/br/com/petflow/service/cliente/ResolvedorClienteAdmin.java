package br.com.petflow.service.cliente;

import br.com.petflow.dto.AgendamentoRequestDTO;
import br.com.petflow.model.Cliente;
import br.com.petflow.model.Usuario;
import br.com.petflow.repository.ClienteRepository;
import jakarta.persistence.EntityNotFoundException;

/**
 * GoF Factory Method (produto concreto): o ADMIN informa o clienteId no pedido.
 */
public class ResolvedorClienteAdmin implements ResolvedorCliente {

    private final ClienteRepository clienteRepository;

    public ResolvedorClienteAdmin(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Override
    public Cliente resolver(Usuario usuarioLogado, AgendamentoRequestDTO dto) {
        if (dto.clienteId() == null) {
            throw new IllegalArgumentException("O clienteId é obrigatório para o Admin criar agendamentos.");
        }
        return clienteRepository.findById(dto.clienteId())
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado com ID: " + dto.clienteId()));
    }
}
