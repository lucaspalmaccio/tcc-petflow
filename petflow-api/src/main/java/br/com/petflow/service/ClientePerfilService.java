package br.com.petflow.service;

import br.com.petflow.dto.AlterarSenhaDTO;
import br.com.petflow.dto.ClienteDTO;
import br.com.petflow.exception.ResourceNotFoundException;
import br.com.petflow.exception.UnauthorizedException;
import br.com.petflow.model.Cliente;
import br.com.petflow.model.Usuario;
import br.com.petflow.repository.ClienteRepository;
import br.com.petflow.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClientePerfilService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Cliente buscarClientePorEmail(UserDetails userDetails) {
        String email = userDetails.getUsername();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com email: " + email));

        return clienteRepository.findByUsuario(usuario)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado para o usuário: " + email));
    }

    public ClienteDTO buscarPerfilCliente(UserDetails userDetails) {
        Cliente cliente = buscarClientePorEmail(userDetails);
        return convertToDTO(cliente);
    }

    @Transactional
    public ClienteDTO atualizarPerfilCliente(UserDetails userDetails, ClienteDTO clienteDTO) {
        Cliente cliente = buscarClientePorEmail(userDetails);

        cliente.setTelefone(clienteDTO.getTelefone());
        cliente.setEndereco(clienteDTO.getEndereco());

        Usuario usuario = cliente.getUsuario();
        usuario.setNome(clienteDTO.getNome());
        usuarioRepository.save(usuario);

        Cliente atualizado = clienteRepository.save(cliente);
        return convertToDTO(atualizado);
    }

    /**
     * BCrypt para validar senha atual
     */
    @Transactional
    public void alterarSenha(UserDetails userDetails, AlterarSenhaDTO dto) {
        Cliente cliente = buscarClientePorEmail(userDetails);
        Usuario usuario = cliente.getUsuario();

        // Valida senha atual usando BCrypt
        if (!passwordEncoder.matches(dto.getSenhaAtual(), usuario.getSenha())) {
            throw new UnauthorizedException("Senha atual incorreta");
        }

        // Valida confirmação
        if (!dto.getNovaSenha().equals(dto.getConfirmarNovaSenha())) {
            throw new IllegalArgumentException("As senhas não coincidem");
        }

        // Atualiza senha criptografada
        usuario.setSenha(passwordEncoder.encode(dto.getNovaSenha()));

        usuarioRepository.save(usuario);
    }

    private ClienteDTO convertToDTO(Cliente cliente) {
        ClienteDTO dto = new ClienteDTO();
        dto.setId(cliente.getId());
        dto.setCpf(cliente.getCpf());
        dto.setTelefone(cliente.getTelefone());
        dto.setEndereco(cliente.getEndereco());
        dto.setNome(cliente.getUsuario().getNome());
        dto.setEmail(cliente.getUsuario().getEmail());
        dto.setUsuarioId(cliente.getUsuario().getId());
        return dto;
    }
}