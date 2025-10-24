import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AgendamentoService } from '../../../admin/services/agendamento.service';
import { AgendamentoResponse } from '../../../admin/models/agendamento.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ClienteService } from '../../../admin/services/cliente.service';
import { Cliente } from '../../../admin/models/cliente.model';

@Component({
selector: 'app-meus-agendamentos',
templateUrl: './meus-agendamentos.component.html',
styleUrls: ['./meus-agendamentos.component.css']
})
export class MeusAgendamentosComponent implements OnInit {

public agendamentos$: Observable<AgendamentoResponse[]>;
public isLoading = true;
public error: string | null = null;

// Dados necessários para o modal de criação
public clienteLogado: Cliente | null = null;

// Estado do Modal
public isModalOpen = false;

constructor(
    private agendamentoService: AgendamentoService,
    private clienteService: ClienteService, // Para buscar os pets do cliente
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadAgendamentos();
    this.loadClienteData();
  }

  /**
   * UC05 - Carrega a lista de agendamentos do cliente logado.
   * O back-end filtra automaticamente pelo token.
   */
  loadAgendamentos(): void {
    this.isLoading = true;
    this.error = null;
    this.agendamentos$ = this.agendamentoService.getAgendamentos();

    this.agendamentos$.subscribe({
      next: () => this.isLoading = false,
      error: (err) => {
        this.isLoading = false;
        this.error = "Falha ao carregar seus agendamentos.";
        console.error(err);
      }
    });
  }

  /**
   * Carrega os dados do cliente (especialmente a lista de pets)
   * para usar no formulário de novo agendamento.
   */
  loadClienteData(): void {
    // Esta é uma simplificação. O ideal é ter um endpoint /api/me/perfil
    // que retorne o cliente logado.
    // Por enquanto, vamos assumir que o /api/clientes (do admin)
    // pode ser usado pelo cliente para pegar seus próprios dados.
    // Vamos corrigir isso: o /api/clientes é só ADMIN.
    // O back-end (AgendamentoService) já trata a segurança,
    // mas o front-end (ClienteService) está protegido por ROLE_ADMIN.

    // **Ajuste de Lógica**: O Cliente precisa de um endpoint para ver seus pets.
    // Vamos assumir (temporariamente) que o /api/pets (protegido por ADMIN)
    // deveria ter um endpoint /api/meus-pets para o cliente.

    // **Solução Temporária**: Como não temos esse endpoint,
    // vamos focar em listar. O modal de criação ficará complexo.
    // **Revisão**: O `AgendamentoService` do back-end já valida o pet.
    // Precisamos de um endpoint para o cliente ver seus pets.
    // Vamos adicionar isso ao `ClienteService` (Angular) e ajustar o back-end (depois).

    // Por enquanto, vamos focar em listar e cancelar.
  }

  /**
   * CT03.4 - Cancelar Agendamento
   */
  onCancel(id: number, data: string): void {
    if (confirm(`Tem certeza que deseja cancelar o agendamento do dia ${data}?`)) {
      this.agendamentoService.cancelarAgendamento(id).subscribe({
        next: () => {
          this.loadAgendamentos(); // Recarrega a lista
        },
        error: (err) => {
          alert("Erro ao cancelar agendamento.");
        }
      });
    }
  }

  /**
   * UC05 - (Fluxo 1) Inicia o fluxo de "Novo Agendamento"
   */
  openAgendamentoModal(): void {
    this.isModalOpen = true;
  }

  closeAgendamentoModal(): void {
    this.isModalOpen = false;
  }

  handleSaveSuccess(): void {
    this.isModalOpen = false;
    this.loadAgendamentos(); // Recarrega a lista após novo agendamento
  }
}
