package br.com.petflow.service.cliente;

import br.com.petflow.dto.AgendamentoRequestDTO;
import br.com.petflow.model.Cliente;
import br.com.petflow.model.Usuario;
import br.com.petflow.repository.ClienteRepository;
import jakarta.persistence.EntityNotFoundException;

/**
 * GoF Factory Method (produto concreto): o CLIENTE agenda sempre no próprio cadastro.
 */
public class ResolvedorClienteProprio implements ResolvedorCliente {

    private final ClienteRepository clienteRepository;

    public ResolvedorClienteProprio(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Override
    public Cliente resolver(Usuario usuarioLogado, AgendamentoRequestDTO dto) {
        return clienteRepository.findByUsuario(usuarioLogado)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Cliente não encontrado para o usuário: " + usuarioLogado.getEmail()));
    }
}
