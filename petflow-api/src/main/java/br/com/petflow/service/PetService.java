package br.com.petflow.service;

import br.com.petflow.dto.PetDTO;
import br.com.petflow.exception.ResourceNotFoundException;
import br.com.petflow.exception.UnauthorizedException;
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

    @Autowired
    private UsuarioRepository usuarioRepository;

    // ============================================
    // MÉTODOS PARA ADMIN (Endpoints /api/pets)
    // ============================================

    /**
     * UC03 - Adicionar Pet (ADMIN)
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
     * UC03 - Listar todos os pets (ADMIN)
     */
    public List<PetDTO> listarTodos() {
        return petRepository.findAll().stream()
                .map(PetDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * UC03 - Buscar pet por ID (ADMIN)
     */
    public PetDTO buscarPorId(Long id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pet não encontrado com ID: " + id));
        return new PetDTO(pet);
    }

    /**
     * UC03 - Atualizar Pet (ADMIN)
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
     * UC03 - Excluir Pet (ADMIN)
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

    // ============================================
    // MÉTODOS PARA CLIENTE (Endpoints /api/clientes/me/pets)
    // ============================================

    /**
     * UC05 - Listar pets do CLIENTE logado
     */
    public List<PetDTO> listarMeusPets(UserDetails userDetails) {
        String email = userDetails.getUsername();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado."));

        Cliente cliente = clienteRepository.findByUsuario(usuario)
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado."));

        return petRepository.findAllByCliente(cliente).stream()
                .map(PetDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Criar pet para o CLIENTE logado
     */
    @Transactional
    public PetDTO criarPetParaCliente(UserDetails userDetails, PetDTO petDTO) {
        String email = userDetails.getUsername();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        Cliente cliente = clienteRepository.findByUsuario(usuario)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));

        Pet pet = new Pet();
        pet.setNome(petDTO.nome());
        pet.setEspecie(petDTO.especie());
        pet.setRaca(petDTO.raca());
        pet.setCliente(cliente);

        Pet novoPet = petRepository.save(pet);
        return new PetDTO(novoPet);
    }

    /**
     * Atualizar pet do CLIENTE logado
     */
    @Transactional
    public PetDTO atualizarPetDoCliente(UserDetails userDetails, Long petId, PetDTO petDTO) {
        String email = userDetails.getUsername();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        Cliente cliente = clienteRepository.findByUsuario(usuario)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));

        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet não encontrado"));

        // Verifica se o pet pertence ao cliente logado
        if (!pet.getCliente().getId().equals(cliente.getId())) {
            throw new UnauthorizedException("Você não tem permissão para editar este pet");
        }

        pet.setNome(petDTO.nome());
        pet.setEspecie(petDTO.especie());
        pet.setRaca(petDTO.raca());

        Pet atualizado = petRepository.save(pet);
        return new PetDTO(atualizado);
    }

    /**
     * Deletar pet do CLIENTE logado
     */
    @Transactional
    public void deletarPetDoCliente(UserDetails userDetails, Long petId) {
        String email = userDetails.getUsername();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        Cliente cliente = clienteRepository.findByUsuario(usuario)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));

        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet não encontrado"));

        // Verifica se o pet pertence ao cliente logado
        if (!pet.getCliente().getId().equals(cliente.getId())) {
            throw new UnauthorizedException("Você não tem permissão para deletar este pet");
        }

        // Verifica se há agendamentos
        if (agendamentoRepository.existsByPet(pet)) {
            throw new IllegalStateException("Não é possível excluir pet com agendamentos vinculados.");
        }

        petRepository.delete(pet);
    }
}