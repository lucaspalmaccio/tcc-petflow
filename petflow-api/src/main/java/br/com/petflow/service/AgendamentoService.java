package br.com.petflow.service;

import br.com.petflow.dto.AgendamentoRequestDTO;
import br.com.petflow.dto.AgendamentoResponseDTO;
import br.com.petflow.model.*;
import br.com.petflow.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <-- Import necessário

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import br.com.petflow.service.ProdutoService;

@Service
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final PetRepository petRepository;
    private final ServicoRepository servicoRepository;
    private final ProdutoService produtoService;

    public AgendamentoService(
            AgendamentoRepository agendamentoRepository,
            ClienteRepository clienteRepository,
            UsuarioRepository usuarioRepository,
            PetRepository petRepository,
            ServicoRepository servicoRepository,
            ProdutoService productService
    ) {
        this.agendamentoRepository = agendamentoRepository;
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.petRepository = petRepository;
        this.servicoRepository = servicoRepository;
        this.produtoService = productService;
    }

    /**
     * Cria um novo agendamento.
     */
    @Transactional // (Correto, pois este método *escreve*)
    public AgendamentoResponseDTO criarAgendamento(AgendamentoRequestDTO dto, String emailUsuarioLogado) {

        // 1. Busca o usuário
        Usuario usuarioLogado = usuarioRepository.findByEmail(emailUsuarioLogado)
                .orElseThrow(() -> new EntityNotFoundException("Usuário logado não encontrado com email: " + emailUsuarioLogado));

        Cliente cliente;

        // 2. Determina o cliente
        if (usuarioLogado.getPerfil() == PerfilUsuario.ADMIN) {
            if (dto.clienteId() == null) {
                throw new IllegalArgumentException("O clienteId é obrigatório para o Admin criar agendamentos.");
            }
            cliente = clienteRepository.findById(dto.clienteId())
                    .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado com ID: " + dto.clienteId()));
        } else {
            cliente = clienteRepository.findByUsuario(usuarioLogado)
                    .orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado para o usuário: " + emailUsuarioLogado));
        }

        // 3. Busca o Pet e valida
        Pet pet = petRepository.findById(dto.petId())
                .orElseThrow(() -> new EntityNotFoundException("Pet não encontrado com ID: " + dto.petId()));

        if (!pet.getCliente().getId().equals(cliente.getId())) {
            throw new IllegalStateException("Este pet não pertence ao cliente selecionado.");
        }

        // 4. Validações Padrão (Horário e Serviços)
        if (agendamentoRepository.existsByDataHora(dto.dataHora())) {
            throw new IllegalStateException("Horário indisponível. Já existe um agendamento neste horário.");
        }

        List<Servico> servicos = servicoRepository.findAllById(dto.servicoIds());
        if (servicos.isEmpty()) {
            throw new EntityNotFoundException("Nenhum serviço válido encontrado para os IDs informados.");
        }

        // 5. Calcula o valor total
        BigDecimal valorTotal = servicos.stream()
                .map(Servico::getPreco)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 6. Cria e salva o agendamento
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
     * Lista TODOS os agendamentos (Usado pelo Admin no calendário)
     */
    @Transactional(readOnly = true) // <-- CORREÇÃO: Adicionada anotação
    public List<AgendamentoResponseDTO> listarAgendamentos(LocalDateTime inicio, LocalDateTime fim) {
        List<Agendamento> agendamentos = agendamentoRepository.findAllByDataHoraBetween(inicio, fim);
        return agendamentos.stream()
                .map(AgendamentoResponseDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Lista agendamentos de um cliente específico (Usado pelo Cliente)
     */
    @Transactional(readOnly = true) // <-- CORREÇÃO: Adicionada anotação
    public List<AgendamentoResponseDTO> listarAgendamentosDoCliente(String emailCliente) {
        List<Agendamento> agendamentos = agendamentoRepository
                .findAllByClienteUsuarioEmailOrderByDataHoraDesc(emailCliente);

        return agendamentos.stream()
                .map(AgendamentoResponseDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Cancela um agendamento.
     */
    @Transactional // (Correto, pois este método *escreve*)
    public AgendamentoResponseDTO cancelarAgendamento(Long id, String emailUsuarioLogado) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Agendamento não encontrado com ID: " + id));

        Usuario usuarioLogado = usuarioRepository.findByEmail(emailUsuarioLogado)
                .orElseThrow(() -> new EntityNotFoundException("Usuário logado não encontrado"));

        // Regra de permissão
        if (usuarioLogado.getPerfil() == PerfilUsuario.CLIENTE) {
            boolean pertenceAoCliente = agendamento.getCliente() != null &&
                    agendamento.getCliente().getUsuario() != null &&
                    agendamento.getCliente().getUsuario().getEmail().equalsIgnoreCase(emailUsuarioLogado);

            if (!pertenceAoCliente) {
                throw new IllegalStateException("Você não tem permissão para cancelar este agendamento.");
            }
        }

        // Regra de Negócio
        if (agendamento.getStatus() == StatusAgendamento.CONCLUIDO) {
            throw new IllegalStateException("Não é possível cancelar um agendamento já concluído.");
        }

        agendamento.setStatus(StatusAgendamento.CANCELADO);
        Agendamento salvo = agendamentoRepository.save(agendamento);

        return new AgendamentoResponseDTO(salvo);
    }

    /**
     * UC05 - Concluir um Agendamento (Admin)
     */
    @Transactional // (Correto, pois este método *escreve*)
    public AgendamentoResponseDTO concluirAgendamento(Long id) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Agendamento não encontrado com ID: " + id));

        if (agendamento.getStatus() != StatusAgendamento.AGENDADO) {
            throw new IllegalStateException("Apenas agendamentos com status 'AGENDADO' podem ser concluídos.");
        }

        // Lógica de baixa de estoque (Sprint 4)
        Set<Servico> servicosDoAgendamento = agendamento.getServicos();
        for (Servico servico : servicosDoAgendamento) {
            Set<ServicoProduto> produtosUsados = servico.getProdutosUsados();
            for (ServicoProduto item : produtosUsados) {
                Long produtoId = item.getProduto().getId();
                int quantidadeUsada = item.getQuantidade();
                produtoService.darBaixaEstoque(produtoId, quantidadeUsada);
            }
        }

        agendamento.setStatus(StatusAgendamento.CONCLUIDO);
        Agendamento salvo = agendamentoRepository.save(agendamento);

        return new AgendamentoResponseDTO(salvo);
    }
}