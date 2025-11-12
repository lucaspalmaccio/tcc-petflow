package br.com.petflow.service;

import br.com.petflow.dto.ServicoDTO;
import br.com.petflow.model.Servico;
import br.com.petflow.repository.ServicoRepository;
import br.com.petflow.repository.AgendamentoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServicoService {

    @Autowired
    private ServicoRepository servicoRepository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    /**
     * UC04 - Adicionar Serviço
     */
    @Transactional
    public ServicoDTO criarServico(ServicoDTO servicoDTO) {
        if (servicoRepository.existsByNome(servicoDTO.nome())) {
            throw new IllegalArgumentException("Já existe um serviço com este nome.");
        }

        Servico novoServico = new Servico();
        novoServico.setNome(servicoDTO.nome());
        novoServico.setDescricao(servicoDTO.descricao());
        novoServico.setPreco(servicoDTO.preco());

        Servico servicoSalvo = servicoRepository.save(novoServico);
        return new ServicoDTO(servicoSalvo);
    }

    /**
     * UC04 - Listar Serviços
     */
    public List<ServicoDTO> listarTodos() {
        return servicoRepository.findAll()
                .stream()
                .map(ServicoDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * UC04 - Buscar Serviço por ID
     */
    public ServicoDTO buscarPorId(Long id) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Serviço não encontrado com ID: " + id));
        return new ServicoDTO(servico);
    }

    /**
     * UC04 - Editar Serviço
     */
    @Transactional
    public ServicoDTO atualizarServico(Long id, ServicoDTO servicoDTO) {
        Servico servicoExistente = servicoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Serviço não encontrado com ID: " + id));

        // Valida nome duplicado (se for um nome diferente do atual)
        if (!servicoExistente.getNome().equals(servicoDTO.nome()) &&
                servicoRepository.existsByNome(servicoDTO.nome())) {
            throw new IllegalArgumentException("Já existe um serviço com este nome.");
        }

        servicoExistente.setNome(servicoDTO.nome());
        servicoExistente.setDescricao(servicoDTO.descricao());
        servicoExistente.setPreco(servicoDTO.preco());

        Servico servicoAtualizado = servicoRepository.save(servicoExistente);
        return new ServicoDTO(servicoAtualizado);
    }

    /**
     * UC04 - Excluir Serviço
     */
    @Transactional
    public void deletarServico(Long id) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Serviço não encontrado com ID: " + id));

        // UC04 - Fluxo de Exceção: Exclusão de Item com Histórico
        if (agendamentoRepository.existsByServico(servico)) {
            throw new IllegalStateException("Não é possível excluir serviço vinculado a agendamentos.");
        }

        servicoRepository.delete(servico);
    }
}