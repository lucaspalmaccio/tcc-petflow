package br.com.petflow.service;

import br.com.petflow.dto.PetDTO;
import br.com.petflow.model.Cliente;
import br.com.petflow.model.Pet;
import br.com.petflow.model.Usuario;
import br.com.petflow.repository.AgendamentoRepository;
import br.com.petflow.repository.ClienteRepository;
import br.com.petflow.repository.PetRepository;
import br.com.petflow.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PetService {

    @Autowired
    private PetRepository petRepository;
    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private AgendamentoRepository agendamentoRepository;

    // === INÍCIO DA ATUALIZAÇÃO SPRINT 03 ===
    @Autowired
    private UsuarioRepository usuarioRepository;
    // === FIM DA ATUALIZAÇÃO SPRINT 03 ===

    /**
     * UC03 (Implícito no UC02) - Adicionar Pet
     */
    @Transactional
    public PetDTO criarPet(PetDTO petDTO) {
        Cliente cliente = clienteRepository.findById(petDTO.clienteId())
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado com ID: " + petDTO.clienteId()));

        Pet novoPet = new Pet();
        novoPet.setNome(petDTO.nome());
        novoPet.setEspecie(petDTO.especie());
        novoPet.setRaca(petDTO.raca());
        novoPet.setCliente(cliente);

        Pet petSalvo = petRepository.save(novoPet);
        return new PetDTO(petSalvo);
    }

    /**
     * UC03 - Listar todos os pets (geralmente filtrado por cliente)
     */
    public List<PetDTO> listarTodos() {
        return petRepository.findAll().stream()
                .map(PetDTO::new)
                .collect(Collectors.toList());
    }

    // === INÍCIO DA ATUALIZAÇÃO SPRINT 03 ===
    /**
     * UC05 - Busca os pets do cliente logado.
     */
    public List<PetDTO> listarMeusPets(UserDetails userDetails) {
        Usuario usuario = (Usuario) usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado."));

        Cliente cliente = usuario.getCliente();
        if (cliente == null) {
            return Collections.emptyList();
        }

        // Busca os pets associados a este cliente
        return petRepository.findAllByCliente(cliente).stream()
                .map(PetDTO::new)
                .collect(Collectors.toList());
    }
    // === FIM DA ATUALIZAÇÃO SPRINT 03 ===

    /**
     * UC03 - Buscar pet por ID
     */
    public PetDTO buscarPorId(Long id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pet não encontrado com ID: " + id));
        return new PetDTO(pet);
    }

    /**
     * UC03 - Atualizar Pet
     */
    @Transactional
    public PetDTO atualizarPet(Long id, PetDTO petDTO) {
        Pet petExistente = petRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pet não encontrado com ID: " + id));

        if (!petExistente.getCliente().getId().equals(petDTO.clienteId())) {
            Cliente novoCliente = clienteRepository.findById(petDTO.clienteId())
                    .orElseThrow(() -> new EntityNotFoundException("Novo cliente dono não encontrado com ID: " + petDTO.clienteId()));
            petExistente.setCliente(novoCliente);
        }

        petExistente.setNome(petDTO.nome());
        petExistente.setEspecie(petDTO.especie());
        petExistente.setRaca(petDTO.raca());

        Pet petAtualizado = petRepository.save(petExistente);
        return new PetDTO(petAtualizado);
    }

    /**
     * UC03 - Excluir Pet
     */
    @Transactional
    public void deletarPet(Long id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pet não encontrado com ID: " + id));

        if (agendamentoRepository.existsByPet(pet)) {
            throw new IllegalStateException("Não é possível excluir pet com agendamentos vinculados.");
        }

        petRepository.delete(pet);
    }
}
