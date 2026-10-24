package br.com.petflow.service.cliente;

import br.com.petflow.model.PerfilUsuario;
import br.com.petflow.repository.ClienteRepository;
import org.springframework.stereotype.Component;

/**
 * GoF Factory Method: escolhe o ResolvedorCliente adequado ao perfil, sem if/else no service.
 */
@Component
public class ResolvedorClienteFactory {

    private final ClienteRepository clienteRepository;

    public ResolvedorClienteFactory(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public ResolvedorCliente para(PerfilUsuario perfil) {
        return switch (perfil) {
            case ADMIN -> new ResolvedorClienteAdmin(clienteRepository);
            default -> new ResolvedorClienteProprio(clienteRepository);
        };
    }
}
