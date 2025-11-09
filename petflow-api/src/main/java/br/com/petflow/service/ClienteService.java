package br.com.petflow.service;

import br.com.petflow.dto.ClienteDTO;
import br.com.petflow.model.Cliente;
import br.com.petflow.model.PerfilUsuario;
import br.com.petflow.model.Usuario;
import br.com.petflow.repository.ClienteRepository;
import br.com.petflow.repository.UsuarioRepository;
import br.com.petflow.repository.AgendamentoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <-- Import necessário

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Transactional // (Correto, pois este método *escreve*)
    public ClienteDTO criarCliente(ClienteDTO clienteDTO) {
        // Validação de Negócio (UC02 - Fluxos de Exceção)
        if (usuarioRepository.existsByEmail(clienteDTO.getEmail())) {
            throw new IllegalArgumentException("E-mail já cadastrado.");
        }
        if (clienteRepository.existsByCpf(clienteDTO.getCpf())) {
            throw new IllegalArgumentException("CPF já cadastrado.");
        }

        // 1. Criar o Usuario
        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(clienteDTO.getNome());
        novoUsuario.setEmail(clienteDTO.getEmail());
        novoUsuario.setSenhaNormal(clienteDTO.getSenhaNormal());
        novoUsuario.setPerfil(PerfilUsuario.CLIENTE);

        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);

        // 2. Criar o Cliente e vincular ao Usuario
        Cliente novoCliente = new Cliente();
        novoCliente.setCpf(clienteDTO.getCpf());
        novoCliente.setTelefone(clienteDTO.getTelefone());
        novoCliente.setEndereco(clienteDTO.getEndereco());
        novoCliente.setUsuario(usuarioSalvo);

        Cliente clienteSalvo = clienteRepository.save(novoCliente);

        return new ClienteDTO(clienteSalvo);
    }

    /**
     * UC02 - Fluxo Principal: Consultar Clientes
     */
    @Transactional(readOnly = true) // <-- CORREÇÃO: Adicionada anotação
    public List<ClienteDTO> listarTodos() {
        return clienteRepository.findAll()
                .stream()
                .map(ClienteDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * UC02 - Fluxo Principal: Gerenciar Cliente Existente (Consulta por ID)
     */
    @Transactional(readOnly = true) // <-- CORREÇÃO: Adicionada anotação
    public ClienteDTO buscarPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado com ID: " + id));
        return new ClienteDTO(cliente);
    }

    /**
     * UC02 - Fluxo Principal: Editar Cliente
     */
    @Transactional // (Correto, pois este método *escreve*)
    public ClienteDTO atualizarCliente(Long id, ClienteDTO clienteDTO) {
        Cliente clienteExistente = clienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado com ID: " + id));

        // Valida CPF duplicado
        if (!clienteExistente.getCpf().equals(clienteDTO.getCpf()) && clienteRepository.existsByCpf(clienteDTO.getCpf())) {
            throw new IllegalArgumentException("CPF já cadastrado em outra conta.");
        }

        // Atualiza dados do Cliente
        clienteExistente.setCpf(clienteDTO.getCpf());
        clienteExistente.setTelefone(clienteDTO.getTelefone());
        clienteExistente.setEndereco(clienteDTO.getEndereco());

        // Atualiza dados do Usuario associado
        Usuario usuario = clienteExistente.getUsuario();
        usuario.setNome(clienteDTO.getNome());

        Cliente clienteAtualizado = clienteRepository.save(clienteExistente);
        return new ClienteDTO(clienteAtualizado);
    }

    /**
     * UC02 - Fluxo Principal: Excluir Cliente
     */
    @Transactional // (Correto, pois este método *escreve*)
    public void deletarCliente(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado com ID: " + id));

        // UC02 - Fluxo de Exceção: Exclusão de Cliente com Histórico
        if (agendamentoRepository.existsByCliente(cliente)) {
            throw new IllegalStateException("Não é possível excluir cliente com agendamentos vinculados.");
        }

        clienteRepository.delete(cliente);
        usuarioRepository.delete(cliente.getUsuario());
    }
}