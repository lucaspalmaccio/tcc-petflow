package br.com.petflow.service;

// === INÍCIO SPRINT 04 ===
import br.com.petflow.dto.EstoqueRequestDTO;
// === FIM SPRINT 04 ===
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
     * UC04 - Editar Produto (Dados Principais, não o estoque)
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

        // === ATUALIZAÇÃO SPRINT 04 ===
        // A QtdEstoque não é mais atualizada aqui,
        // mas sim por métodos específicos de controle de estoque.
        // produtoExistente.setQtdEstoque(produtoDTO.qtdEstoque());
        // === FIM SPRINT 04 ===

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

        // Fluxo de Exceção: Exclusão de Item com Histórico
        // (Adicionar lógica de verificação de vendas/agendamentos aqui)

        produtoRepository.delete(produto);
    }

    // === INÍCIO SPRINT 04 (Controle de Estoque) ===

    /**
     * UC06 (CT04.2) - Adicionar itens ao estoque (Entrada Manual)
     */
    @Transactional
    public ProdutoDTO adicionarEstoque(Long id, EstoqueRequestDTO dto) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado com ID: " + id));

        if (dto.quantidade() <= 0) {
            throw new IllegalArgumentException("A quantidade a ser adicionada deve ser positiva.");
        }

        int novoEstoque = produto.getQtdEstoque() + dto.quantidade();
        produto.setQtdEstoque(novoEstoque);

        Produto produtoAtualizado = produtoRepository.save(produto);
        return new ProdutoDTO(produtoAtualizado);
    }

    /**
     * UC06 (CT04.1) - Dar baixa em um item do estoque (Usado pelo AgendamentoService)
     */
    @Transactional
    public void darBaixaEstoque(Long id, int quantidade) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado com ID: " + id + " para baixa de estoque."));

        int novoEstoque = produto.getQtdEstoque() - quantidade;

        // (Nota: Permitimos estoque negativo por simplicidade,
        //  mas uma regra de negócio real poderia impedir isso.)
        // if (novoEstoque < 0) {
        //    throw new IllegalStateException("Estoque insuficiente para o produto: " + produto.getNome());
        // }

        produto.setQtdEstoque(novoEstoque);
        produtoRepository.save(produto);
    }
    // === FIM SPRINT 04 ===
}
