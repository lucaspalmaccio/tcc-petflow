package br.com.petflow.service.cliente;

import br.com.petflow.dto.AgendamentoRequestDTO;
import br.com.petflow.model.Cliente;
import br.com.petflow.model.Usuario;

/**
 * GoF Factory Method (produto): define como descobrir o cliente dono de um agendamento.
 */
public interface ResolvedorCliente {

    Cliente resolver(Usuario usuarioLogado, AgendamentoRequestDTO dto);
}
