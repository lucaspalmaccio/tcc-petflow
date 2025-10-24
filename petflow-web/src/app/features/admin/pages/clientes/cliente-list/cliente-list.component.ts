import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';

@Component({
selector: 'app-cliente-list',
templateUrl: './cliente-list.component.html',
styleUrls: ['./cliente-list.component.css']
})
export class ClienteListComponent implements OnInit {

// Usamos Observable com 'async' pipe no template
public clientes$: Observable<Cliente[]>;
public isLoading = true;
public error: string | null = null;

constructor(
    private clienteService: ClienteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.isLoading = true;
    this.error = null;
    this.clientes$ = this.clienteService.getAllClientes();

    // Tratamento de loading/error (embora o 'async' pipe ajude)
    this.clientes$.subscribe({
      next: () => this.isLoading = false,
      error: (err) => {
        this.isLoading = false;
        this.error = "Falha ao carregar clientes. Tente novamente.";
        console.error(err);
      }
    });
  }

  /**
   * Navega para o formulário de criação.
   * UC02 - Fluxo "Adicionar um Cliente"
   */
  navigateToAdd(): void {
    this.router.navigate(['/admin/clientes/novo']);
  }

  /**
   * Navega para o formulário de edição.
   * UC02 - Fluxo "Gerenciar um Cliente Existente"
   */
  navigateToEdit(id: number): void {
    this.router.navigate(['/admin/clientes/editar', id]);
  }

  /**
   * Exclui um cliente.
   * UC02 - Fluxo "Excluir Cliente"
   */
  onDelete(id: number, nome: string): void {
    // Fluxo UC02 [136]: Pede confirmação
    if (confirm(`Tem certeza que deseja excluir o cliente "${nome}"?`)) {
      this.clienteService.deleteCliente(id).subscribe({
        next: () => {
          // Recarrega a lista após a exclusão
          this.loadClientes();
          // (Poderia ter um toast de sucesso aqui)
        },
        error: (err) => {
          // Fluxo UC02 [138]: Exclusão com Histórico (tratado no back-end)
          this.error = err.error?.erro || "Falha ao excluir cliente. Verifique se ele possui agendamentos.";
          console.error(err);
        }
      });
    }
  }
}