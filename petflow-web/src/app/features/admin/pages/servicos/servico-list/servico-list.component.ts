import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Servico } from '../../../models/servico.model';
import { ServicoService } from '../../../services/servico.service';

@Component({
selector: 'app-servico-list',
templateUrl: './servico-list.component.html',
// Reutilizaremos o CSS do cliente-list, pois é idêntico
styleUrls: ['../../clientes/cliente-list/cliente-list.component.css']
})
export class ServicoListComponent implements OnInit {

public servicos$: Observable<Servico[]>;
public isLoading = true;
public error: string | null = null;

constructor(
    private servicoService: ServicoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadServicos();
  }

  loadServicos(): void {
    this.isLoading = true;
    this.error = null;
    this.servicos$ = this.servicoService.getAllServicos();

    this.servicos$.subscribe({
      next: () => this.isLoading = false,
      error: (err) => {
        this.isLoading = false;
        this.error = "Falha ao carregar serviços. Tente novamente.";
        console.error(err);
      }
    });
  }

  navigateToAdd(): void {
    this.router.navigate(['/admin/servicos/novo']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/admin/servicos/editar', id]);
  }

  onDelete(id: number, nome: string): void {
    // Pede confirmação
    if (confirm(`Tem certeza que deseja excluir o serviço "${nome}"?`)) {
      this.servicoService.deleteServico(id).subscribe({
        next: () => {
          this.loadServicos(); // Recarrega a lista
        },
        error: (err) => {
          [cite_start]// Fluxo de Exceção: Item com Histórico [cite: 413]
          this.error = err.error?.erro || "Falha ao excluir. Verifique se o serviço está vinculado a agendamentos.";
          console.error(err);
        }
      });
    }
  }
}