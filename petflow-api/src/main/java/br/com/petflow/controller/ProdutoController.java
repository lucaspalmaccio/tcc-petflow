package br.com.petflow.controller;

// === INÍCIO SPRINT 04 ===
import br.com.petflow.dto.EstoqueRequestDTO;
// === FIM SPRINT 04 ===
import br.com.petflow.dto.ProdutoDTO;
import br.com.petflow.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos") // Rota será protegida (ROLE_ADMIN)
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    /**
     * UC04 - Adicionar Produto
     */
    @PostMapping
    public ResponseEntity<ProdutoDTO> criarProduto(@RequestBody @Valid ProdutoDTO produtoDTO) {
        ProdutoDTO novoProduto = produtoService.criarProduto(produtoDTO);
        return new ResponseEntity<>(novoProduto, HttpStatus.CREATED);
    }

    /**
     * UC04 - Listar Produtos
     */
    @GetMapping
    public ResponseEntity<List<ProdutoDTO>> listarProdutos() {
        return ResponseEntity.ok(produtoService.listarTodos());
    }

    /**
     * UC04 - Buscar Produto por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProdutoDTO> buscarProdutoPorId(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.buscarPorId(id));
    }

    /**
     * UC04 - Editar Produto (Dados Principais, não o estoque)
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProdutoDTO> atualizarProduto(@PathVariable Long id, @RequestBody @Valid ProdutoDTO produtoDTO) {
        // Este endpoint agora atualiza apenas dados cadastrais (nome, preço)
        ProdutoDTO produtoAtualizado = produtoService.atualizarProduto(id, produtoDTO);
        return ResponseEntity.ok(produtoAtualizado);
    }

    /**
     * UC04 - Excluir Produto
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProduto(@PathVariable Long id) {
        produtoService.deletarProduto(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * UC06 (CT04.2) - Adicionar itens ao estoque (Entrada Manual)
     */
    @PatchMapping("/{id}/adicionar-estoque")
    public ResponseEntity<ProdutoDTO> adicionarEstoque(
            @PathVariable Long id,
            @RequestBody @Valid EstoqueRequestDTO dto) {

        ProdutoDTO produtoAtualizado = produtoService.adicionarEstoque(id, dto);
        return ResponseEntity.ok(produtoAtualizado);
    }

}