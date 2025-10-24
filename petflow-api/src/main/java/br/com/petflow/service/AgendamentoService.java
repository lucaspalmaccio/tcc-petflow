package br.com.petflow.service;

import br.com.petflow.dto.AgendamentoRequestDTO;
import br.com.petflow.dto.AgendamentoResponseDTO;
import br.com.petflow.model.*;
import br.com.petflow.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgendamentoService {

    @Autowired private AgendamentoRepository agendamentoRepository;
    @Autowired private ClienteRepository clienteRepository;
    @Autowired private PetRepository petRepository;
    @Autowired private ServicoRepository servicoRepository;
    @Autowired private UsuarioRepository usuarioRepository;

    /**
     * UC05 - Realizar Agendamento
     */
    @Transactional
    public AgendamentoResponseDTO criarAgendamento(AgendamentoRequestDTO dto, UserDetails userDetails) {

        Usuario usuarioLogado = (Usuario) usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado."));

        // 1. Identificar o Cliente
        Cliente cliente;
        if (usuarioLogado.getPerfil() == PerfilUsuario.ADMIN) {
            // ADMIN: Pega o clienteId do DTO
            cliente = clienteRepository.findById(dto.clienteId())
                    .orElseThrow(() -> new EntityNotFoundException("Cliente (via Admin) não encontrado com ID: " + dto.clienteId()));
        } else {
            // CLIENTE: Pega o cliente associado ao seu próprio usuário
            cliente = usuarioLogado.getCliente();
            if (cliente == null) {
                throw new AccessDeniedException("Usuário cliente não possui um perfil de cliente associado.");
            }
        }

        // 2. Validar o Pet
        Pet pet = petRepository.findById(dto.petId())
                .orElseThrow(() -> new EntityNotFoundException("Pet não encontrado com ID: " + dto.petId()));

        // 3. REGRA DE SEGURANÇA (Ownership): Se for CLIENTE, validar se o pet é dele
        if (usuarioLogado.getPerfil() == PerfilUsuario.CLIENTE && !pet.getCliente().equals(cliente)) {
            throw new AccessDeniedException("Acesso negado: O pet selecionado não pertence a este cliente.");
        }

        // 4. Validar Conflito de Horário (CT03.2)
        if (agendamentoRepository.existsByDataHora(dto.dataHora())) {
            throw new IllegalStateException("Horário indisponível. Já existe um agendamento neste horário."); // [cite: 109]
        }

        // 5. Buscar Serviços e Calcular Valor Total
        List<Servico> servicos = servicoRepository.findAllById(dto.servicoIds());
        if (servicos.size() != dto.servicoIds().size()) {
            throw new EntityNotFoundException("Um ou mais serviços não foram encontrados.");
        }

        BigDecimal valorTotal = servicos.stream()
                .map(Servico::getPreco)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 6. Criar e Salvar o Agendamento
        Agendamento agendamento = new Agendamento();
        agendamento.setCliente(cliente);
        agendamento.setPet(pet);
        agendamento.setDataHora(dto.dataHora());
        agendamento.setServicos(new HashSet<>(servicos));
        agendamento.setValorTotal(valorTotal);
        agendamento.setStatus(StatusAgendamento.AGENDADO); // [cite: 425]

        Agendamento agendamentoSalvo = agendamentoRepository.save(agendamento);
        return new AgendamentoResponseDTO(agendamentoSalvo);
    }

    /**
     * UC05 - Consultar Agenda (Visão Admin) ou Meus Agendamentos (Visão Cliente)
     */
    public List<AgendamentoResponseDTO> listarAgendamentos(LocalDateTime inicio, LocalDateTime fim, UserDetails userDetails) {
        Usuario usuarioLogado = (Usuario) usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado."));

        List<Agendamento> agendamentos;

        if (usuarioLogado.getPerfil() == PerfilUsuario.ADMIN) {
            // Admin: Busca por período (para o calendário)
            agendamentos = agendamentoRepository.findAllByDataHoraBetween(inicio, fim);
        } else {
            // Cliente: Busca todos os seus (ignora o período por simplicidade)
            agendamentos = agendamentoRepository.findAllByClienteUsuarioEmailOrderByDataHoraDesc(usuarioLogado.getEmail());
        }

        return agendamentos.stream()
                .map(AgendamentoResponseDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * UC05 (Implícito) e CT03.4 - Cancelar Agendamento
     */
    @Transactional
    public AgendamentoResponseDTO cancelarAgendamento(Long id, UserDetails userDetails) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Agendamento não encontrado com ID: " + id));

        Usuario usuarioLogado = (Usuario) usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado."));

        // REGRA DE SEGURANÇA (Ownership): Cliente só pode cancelar o que é dele.
        if (usuarioLogado.getPerfil() == PerfilUsuario.CLIENTE &&
                !agendamento.getCliente().getUsuario().equals(usuarioLogado)) {
            throw new AccessDeniedException("Acesso negado: Você não pode cancelar este agendamento.");
        }

        // CT03.4 - Cancelar e verificar liberação (aqui apenas mudamos o status)
        agendamento.setStatus(StatusAgendamento.CANCELADO); // [cite: 112]

        Agendamento agendamentoSalvo = agendamentoRepository.save(agendamento);
        return new AgendamentoResponseDTO(agendamentoSalvo);
    }
}