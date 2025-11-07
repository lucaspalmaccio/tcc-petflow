import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of, switchMap, tap } from 'rxjs'; // Imports atualizados
import { Produto } from '../../../models/produto.model';
import { ProdutoService } from '../../../services/produto.service';

@Component({
selector: 'app-produto-list',
templateUrl: './produto-list.component.html',
// === ATUALIZAÇÃO SPRINT 04 ===
// Vamos usar um CSS próprio para este componente
styleUrls: ['./produto-list.component.css']
// === FIM ATUALIZAÇÃO SPRINT 04 ===
})
export class ProdutoListComponent implements OnInit {

public produtos$!: Observable<Produto[]>;
public isLoading = true;
public error: string | null = null;

// === INÍCIO SPRINT 04 (UC06 - Controle do Modal) ===
public showStockModal = false;
public selectedProduto: Produto | null = null;
public quantidadeEstoque: number = 1;
public modalError: string | null = null;
public modalLoading = false;
// === FIM SPRINT 04 ===

constructor(
    private produtoService: ProdutoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProdutos();
  }

  loadProdutos(): void {
    this.isLoading = true;
    this.error = null;
    // Usamos 'pipe' para garantir que o loading termine
    this.produtos$ = this.produtoService.getAllProdutos().pipe(
      tap(() => this.isLoading = false),
      catchError((err) => {
        this.isLoading = false;
        this.error = "Falha ao carregar produtos. Tente novamente.";
        console.error(err);
        return of([]); // Retorna um array vazio em caso de erro
      })
    );
  }

  navigateToAdd(): void {
    this.router.navigate(['/admin/produtos/novo']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/admin/produtos/editar', id]);
  }

  onDelete(id: number, nome: string): void {
    if (confirm(`Tem certeza que deseja excluir o produto "${nome}"?`)) {
      this.produtoService.deleteProduto(id).subscribe({
        next: () => {
          this.loadProdutos(); // Recarrega a lista
        },
        error: (err) => {
          this.error = err.error?.message || "Falha ao excluir produto. Pode estar vinculado a um agendamento.";
          console.error(err);
        }
      });
    }
  }

  // === INÍCIO SPRINT 04 (UC06 - Métodos do Modal) ===

  /**
   * Abre o modal para adicionar estoque a um produto específico
   */
  openStockModal(produto: Produto): void {
    this.selectedProduto = produto;
    this.quantidadeEstoque = 1; // Reseta a quantidade
    this.modalError = null;
    this.modalLoading = false;
    this.showStockModal = true;
  }

  /**
   * Fecha o modal de estoque
   */
  closeStockModal(): void {
    if (this.modalLoading) return; // Não deixa fechar se estiver salvando
    this.showStockModal = false;
    this.selectedProduto = null;
  }

  /**
   * Chamado ao submeter o formulário do modal
   */
  onStockSubmit(): void {
    // Validações
    if (!this.selectedProduto || this.quantidadeEstoque <= 0) {
      this.modalError = "Por favor, insira uma quantidade válida (maior que zero).";
      return;
    }

    this.modalLoading = true;
    this.modalError = null;
    const id = this.selectedProduto.id;
    const quantidade = this.quantidadeEstoque;

    // Chama o serviço que criamos
    this.produtoService.adicionarEstoque(id, quantidade).subscribe({
      next: (produtoAtualizado) => {
        this.modalLoading = false;
        this.closeStockModal();
        // Atualiza a lista de produtos na tela
        this.loadProdutos();
      },
      error: (err) => {
        this.modalLoading = false;
        console.error('Erro ao adicionar estoque', err);
        this.modalError = err.error?.message || "Falha ao atualizar estoque.";
      }
    });
  }
  // === FIM SPRINT 04 ===
}