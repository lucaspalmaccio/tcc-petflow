package br.com.petflow.service;

import br.com.petflow.dto.AgendamentoRequestDTO;
import br.com.petflow.dto.AgendamentoResponseDTO;
import br.com.petflow.model.*;
import br.com.petflow.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final PetRepository petRepository;
    private final ServicoRepository servicoRepository;

    public AgendamentoService(
            AgendamentoRepository agendamentoRepository,
            ClienteRepository clienteRepository,
            UsuarioRepository usuarioRepository,
            PetRepository petRepository,
            ServicoRepository servicoRepository
    ) {
        this.agendamentoRepository = agendamentoRepository;
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.petRepository = petRepository;
        this.servicoRepository = servicoRepository;
    }

    /**
     * Cria um novo agendamento para o cliente logado.
     */
    @Transactional
    public AgendamentoResponseDTO criarAgendamento(AgendamentoRequestDTO dto, String emailUsuarioLogado) {

        // Busca o usuário logado
        Usuario usuario = usuarioRepository.findByEmail(emailUsuarioLogado)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com email: " + emailUsuarioLogado));

        // Busca o cliente vinculado a esse usuário
        Cliente cliente = clienteRepository.findByUsuario(usuario)
                .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado para o usuário informado"));

        // Busca o pet
        Pet pet = petRepository.findById(dto.petId())
                .orElseThrow(() -> new EntityNotFoundException("Pet não encontrado com ID: " + dto.petId()));

        // Verifica se o horário está disponível
        if (agendamentoRepository.existsByDataHora(dto.dataHora())) {
            throw new IllegalStateException("Horário indisponível. Já existe um agendamento neste horário.");
        }

        // Busca os serviços selecionados
        List<Servico> servicos = servicoRepository.findAllById(dto.servicoIds());
        if (servicos.isEmpty()) {
            throw new EntityNotFoundException("Nenhum serviço válido encontrado para os IDs informados.");
        }

        // Calcula o valor total
        BigDecimal valorTotal = servicos.stream()
                .map(Servico::getPreco)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Cria o agendamento
        Agendamento agendamento = new Agendamento();
        agendamento.setCliente(cliente);
        agendamento.setPet(pet);
        agendamento.setDataHora(dto.dataHora());
        agendamento.setServicos(new HashSet<>(servicos));
        agendamento.setValorTotal(valorTotal);
        agendamento.setStatus(StatusAgendamento.AGENDADO);

        Agendamento salvo = agendamentoRepository.save(agendamento);
        return new AgendamentoResponseDTO(salvo);
    }

    /**
     * Lista todos os agendamentos entre duas datas.
     * (usado para administradores ou dashboards)
     */
    public List<AgendamentoResponseDTO> listarAgendamentos(LocalDateTime inicio, LocalDateTime fim) {
        List<Agendamento> agendamentos = agendamentoRepository.findAllByDataHoraBetween(inicio, fim);
        return agendamentos.stream()
                .map(AgendamentoResponseDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Lista todos os agendamentos do cliente logado.
     */
    public List<AgendamentoResponseDTO> listarAgendamentosDoCliente(String emailCliente) {
        List<Agendamento> agendamentos = agendamentoRepository
                .findAllByClienteUsuarioEmailOrderByDataHoraDesc(emailCliente);

        return agendamentos.stream()
                .map(AgendamentoResponseDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Cancela um agendamento do cliente logado.
     */
    @Transactional
    public AgendamentoResponseDTO cancelarAgendamento(Long id, String emailUsuarioLogado) {
        // Busca o agendamento
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Agendamento não encontrado com ID: " + id));

        // Verifica se pertence ao cliente logado
        boolean pertenceAoCliente = agendamento.getCliente() != null &&
                agendamento.getCliente().getUsuario() != null &&
                agendamento.getCliente().getUsuario().getEmail().equalsIgnoreCase(emailUsuarioLogado);

        if (!pertenceAoCliente) {
            throw new IllegalStateException("Você não tem permissão para cancelar este agendamento.");
        }

        // Atualiza o status
        agendamento.setStatus(StatusAgendamento.CANCELADO);
        Agendamento salvo = agendamentoRepository.save(agendamento);

        return new AgendamentoResponseDTO(salvo);
    }
}
