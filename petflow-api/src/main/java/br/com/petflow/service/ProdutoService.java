package br.com.petflow.service;

import br.com.petflow.dto.ProdutoDTO;
import br.com.petflow.model.Produto;
import br.com.petflow.repository.ProdutoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    /**
     * UC04 - Adicionar Produto
     */
    @Transactional
    public ProdutoDTO criarProduto(ProdutoDTO produtoDTO) {
        if (produtoRepository.existsByNome(produtoDTO.nome())) {
            throw new IllegalArgumentException("Já existe um produto com este nome.");
        }

        Produto novoProduto = new Produto();
        novoProduto.setNome(produtoDTO.nome());
        novoProduto.setDescricao(produtoDTO.descricao());
        novoProduto.setPrecoCusto(produtoDTO.precoCusto());
        novoProduto.setPrecoVenda(produtoDTO.precoVenda());
        novoProduto.setQtdEstoque(produtoDTO.qtdEstoque());

        Produto produtoSalvo = produtoRepository.save(novoProduto);
        return new ProdutoDTO(produtoSalvo);
    }

    /**
     * UC04 - Listar Produtos
     */
    public List<ProdutoDTO> listarTodos() {
        return produtoRepository.findAll()
                .stream()
                .map(ProdutoDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * UC04 - Buscar Produto por ID
     */
    public ProdutoDTO buscarPorId(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado com ID: " + id));
        return new ProdutoDTO(produto);
    }

    /**
     * UC04 - Editar Produto
     */
    @Transactional
    public ProdutoDTO atualizarProduto(Long id, ProdutoDTO produtoDTO) {
        Produto produtoExistente = produtoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado com ID: " + id));

        // Valida nome duplicado
        if (!produtoExistente.getNome().equals(produtoDTO.nome()) &&
                produtoRepository.existsByNome(produtoDTO.nome())) {
            throw new IllegalArgumentException("Já existe um produto com este nome.");
        }

        produtoExistente.setNome(produtoDTO.nome());
        produtoExistente.setDescricao(produtoDTO.descricao());
        produtoExistente.setPrecoCusto(produtoDTO.precoCusto());
        produtoExistente.setPrecoVenda(produtoDTO.precoVenda());
        produtoExistente.setQtdEstoque(produtoDTO.qtdEstoque());

        Produto produtoAtualizado = produtoRepository.save(produtoExistente);
        return new ProdutoDTO(produtoAtualizado);
    }

    /**
     * UC04 - Excluir Produto
     */
    @Transactional
    public void deletarProduto(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado com ID: " + id));

        // Fluxo de Exceção[cite: 413]: Exclusão de Item com Histórico
        // (Adicionar lógica de verificação de vendas/agendamentos aqui)

        produtoRepository.delete(produto);
    }
}