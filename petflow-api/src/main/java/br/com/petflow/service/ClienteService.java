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
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public ClienteDTO criarCliente(ClienteDTO clienteDTO) {
        // Validação de Negócio (UC02 - Fluxos de Exceção)
        if (usuarioRepository.existsByEmail(clienteDTO.email())) {
            throw new IllegalArgumentException("E-mail já cadastrado.");
        }
        if (clienteRepository.existsByCpf(clienteDTO.cpf())) {
            throw new IllegalArgumentException("CPF já cadastrado.");
        }

        // 1. Criar o Usuario
        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(clienteDTO.nome());
        novoUsuario.setEmail(clienteDTO.email());
        novoUsuario.setSenha(passwordEncoder.encode(clienteDTO.senha())); // Criptografa a senha
        novoUsuario.setPerfil(PerfilUsuario.CLIENTE); // Todo cliente tem perfil CLIENTE

        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);

        // 2. Criar o Cliente e vincular ao Usuario
        Cliente novoCliente = new Cliente();
        novoCliente.setCpf(clienteDTO.cpf());
        novoCliente.setTelefone(clienteDTO.telefone());
        novoCliente.setEndereco(clienteDTO.endereco());
        novoCliente.setUsuario(usuarioSalvo);

        Cliente clienteSalvo = clienteRepository.save(novoCliente);

        return new ClienteDTO(clienteSalvo);
    }

    /**
     * UC02 - Fluxo Principal: Consultar Clientes
     */
    public List<ClienteDTO> listarTodos() {
        return clienteRepository.findAll()
                .stream()
                .map(ClienteDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * UC02 - Fluxo Principal: Gerenciar Cliente Existente (Consulta por ID)
     */
    public ClienteDTO buscarPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado com ID: " + id));
        return new ClienteDTO(cliente);
    }

    /**
     * UC02 - Fluxo Principal: Editar Cliente
     * (Nota: Esta implementação simplificada não permite alterar e-mail ou senha após o cadastro)
     */
    @Transactional
    public ClienteDTO atualizarCliente(Long id, ClienteDTO clienteDTO) {
        Cliente clienteExistente = clienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado com ID: " + id));

        // Valida CPF duplicado (se for um CPF diferente do atual)
        if (!clienteExistente.getCpf().equals(clienteDTO.cpf()) && clienteRepository.existsByCpf(clienteDTO.cpf())) {
            throw new IllegalArgumentException("CPF já cadastrado em outra conta.");
        }

        // Atualiza dados do Cliente
        clienteExistente.setCpf(clienteDTO.cpf());
        clienteExistente.setTelefone(clienteDTO.telefone());
        clienteExistente.setEndereco(clienteDTO.endereco());

        // Atualiza dados do Usuario associado
        Usuario usuario = clienteExistente.getUsuario();
        usuario.setNome(clienteDTO.nome());
        // (Não atualizamos e-mail ou senha aqui para simplificar)

        Cliente clienteAtualizado = clienteRepository.save(clienteExistente);
        return new ClienteDTO(clienteAtualizado);
    }

    /**
     * UC02 - Fluxo Principal: Excluir Cliente
     * (Implementa exclusão lógica ou verificação de histórico)
     */
    @Transactional
    public void deletarCliente(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado com ID: " + id));

        // UC02 - Fluxo de Exceção: Exclusão de Cliente com Histórico
        if (agendamentoRepository.existsByCliente(cliente)) {
            throw new IllegalStateException("Não é possível excluir cliente com agendamentos vinculados.");
        }
        // (Adicionar lógica de verificação de agendamentos aqui na Sprint 3)
        // if (agendamentoRepository.existsByCliente(cliente)) {
        //    throw new IllegalStateException("Não é possível excluir cliente com agendamentos.");
        // }

        // Exclui o cliente (e o usuário em cascata, se configurado)
        clienteRepository.delete(cliente);
        // Exclui o usuário explicitamente
        usuarioRepository.delete(cliente.getUsuario());
    }
}