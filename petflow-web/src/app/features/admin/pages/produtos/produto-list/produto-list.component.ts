import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Produto } from '../../../models/produto.model';
import { ProdutoService } from '../../../services/produto.service';

@Component({
selector: 'app-produto-list',
templateUrl: './produto-list.component.html',
// Reutilizando o CSS da lista de clientes
styleUrls: ['../../clientes/cliente-list/cliente-list.component.css']
})
export class ProdutoListComponent implements OnInit {

public produtos$: Observable<Produto[]>;
public isLoading = true;
public error: string | null = null;

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
    this.produtos$ = this.produtoService.getAllProdutos();

    this.produtos$.subscribe({
      next: () => this.isLoading = false,
      error: (err) => {
        this.isLoading = false;
        this.error = "Falha ao carregar produtos. Tente novamente.";
        console.error(err);
      }
    });
  }

  navigateToAdd(): void {
    this.router.navigate(['/admin/produtos/novo']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/admin/produtos/editar', id]);
  }

  onDelete(id: number, nome: string): void {
    // Pede confirmação
    if (confirm(`Tem certeza que deseja excluir o produto "${nome}"?`)) {
      this.produtoService.deleteProduto(id).subscribe({
        next: () => {
          this.loadProdutos(); // Recarrega a lista
        },
        error: (err) => {
          // Fluxo de Exceção: Item com Histórico
          this.error = err.error?.erro || "Falha ao excluir produto.";
          console.error(err);
        }
      });
    }
  }
}