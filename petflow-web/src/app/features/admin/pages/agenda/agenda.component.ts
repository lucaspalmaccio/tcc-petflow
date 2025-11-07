import { Component, OnInit } from '@angular/core';
import { AgendamentoService } from '../../../admin/services/agendamento.service';
// === INÍCIO SPRINT 04 (Admin Agendamento) ===
import { ClienteService } from '../../../admin/services/cliente.service';
import { ServicoService } from '../../../admin/services/servico.service';
// (O AgendamentoRequestDTO é importado do model)
import { AgendamentoRequestDTO, AgendamentoResponse } from '../../../admin/models/agendamento.model';
import { Cliente } from '../../../admin/models/cliente.model';
import { Pet } from '../../../admin/models/pet.model';
import { Servico } from '../../../admin/models/servico.model';
import { Observable, Subject, of } from 'rxjs'; // Import 'of'
import { catchError } from 'rxjs/operators';
// === FIM SPRINT 04 ===
import { HttpErrorResponse } from '@angular/common/http';

// Imports do Calendário
import { CalendarEvent, CalendarEventAction, CalendarView } from 'angular-calendar';
import {
startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay,
isSameMonth, addHours, startOfMonth, endOfWeek, startOfWeek,
} from 'date-fns';

// Cores (seu código original)
const colors: any = {
AGENDADO: { primary: '#007bff', secondary: '#D1E7FD' },
CONCLUIDO: { primary: '#198754', secondary: '#D1FAD0' },
CANCELADO: { primary: '#6c757d', secondary: '#E2E3E5' },
};

@Component({
selector: 'app-agenda',
templateUrl: './agenda.component.html',
styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {

// --- Configuração do Calendário (seu código original) ---
view: CalendarView = CalendarView.Month;
CalendarView = CalendarView;
viewDate: Date = new Date();
locale: string = 'pt';
events: CalendarEvent[] = [];
isLoading = true;
refresh = new Subject<void>();
errorMessage: string | null = null;

// === INÍCIO SPRINT 04 (Admin Agendamento) ===
// Variáveis para o Modal de Novo Agendamento
showAdminModal = false;
modalLoading = false;
modalError: string | null = null;

// Listas para os Dropdowns
clientes$!: Observable<Cliente[]>;
petsDoCliente: Pet[] = [];
servicos$!: Observable<Servico[]>;

// Modelo do Formulário
agendamentoForm = {
clienteId: '',
petId: '',
servicoIds: [],
dataHora: this.getMinDateTime()
};
// === FIM SPRINT 04 ===

constructor(
    private agendamentoService: AgendamentoService,
    // === INÍCIO SPRINT 04 (Admin Agendamento) ===
    private clienteService: ClienteService,
    private servicoService: ServicoService
    // === FIM SPRINT 04 ===
  ) { }

  ngOnInit(): void {
    this.loadAgendamentos();
    // === INÍCIO SPRINT 04 (Admin Agendamento) ===
    this.loadDropdownData(); // Carrega clientes e serviços
    // === FIM SPRINT 04 ===
  }

  /**
   * Carrega os agendamentos do back-end (seu método atualizado)
   */
  loadAgendamentos(): void {
    this.isLoading = true;
    this.errorMessage = null;

    const inicio = startOfWeek(startOfMonth(this.viewDate));
    const fim = endOfWeek(endOfMonth(this.viewDate));

    // Este método agora funciona para o Admin (retorna todos)
    // graças à correção que fizemos no AgendamentoController.java
    this.agendamentoService.getAgendamentos(
      inicio.toISOString(),
      fim.toISOString()
    ).subscribe({
      next: (data) => {
        this.events = data.map((ag: AgendamentoResponse) => {
          const actions: CalendarEventAction[] = [];
          if (ag.status === 'AGENDADO') {
            actions.push({
              label: 'Concluir',
              cssClass: 'concluir-action',
              onClick: ({ event }: { event: CalendarEvent }): void => {
                this.concluirAgendamento(event);
              },
            });
          }

          return {
            id: ag.id,
            start: new Date(ag.dataHora),
            title: `(${ag.status.substring(0, 3)}) ${ag.pet.nome} - ${ag.servicos.map(s => s.nome).join(', ')}`,
            color: colors[ag.status] || colors.CANCELADO,
            allDay: false,
            actions: actions,
            meta: { agendamento: ag }
          };
        });
        this.isLoading = false;
        this.refresh.next();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao carregar agendamentos', err);
        this.errorMessage = 'Falha ao carregar agendamentos. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  /**
   * UC05 - Concluir Agendamento (seu método original)
   */
  concluirAgendamento(event: CalendarEvent): void {
    const id = event.id as number;
    if (!confirm(`Deseja realmente concluir este agendamento?\n\n"${event.title}"\n\nEsta ação dará baixa no estoque.`)) {
      return;
    }
    this.errorMessage = null;
    this.agendamentoService.concluirAgendamento(id).subscribe({
      next: (agendamentoAtualizado) => {
        event.meta.agendamento = agendamentoAtualizado;
        event.title = `(CON) ${agendamentoAtualizado.pet.nome} - ${agendamentoAtualizado.servicos.map(s => s.nome).join(', ')}`;
        event.color = colors.CONCLUIDO;
        event.actions = [];
        this.refresh.next();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao concluir agendamento', err);
        this.errorMessage = `Erro ao concluir: ${err.error?.message || 'Tente novamente.'}`;
      }
    });
  }

  // --- Métodos de Controle do Calendário (seus métodos originais) ---
  onViewDateChange(): void {
    this.loadAgendamentos();
  }

  setView(view: CalendarView): void {
    this.view = view;
  }

  // === INÍCIO SPRINT 04 (Lógica do Modal Admin) ===

  /**
   * Carrega os dados para os dropdowns do modal
   */
  loadDropdownData(): void {
    this.clientes$ = this.clienteService.getAllClientes().pipe(
      catchError(err => {
        this.modalError = "Falha ao carregar clientes.";
        return of([]);
      })
    );
    this.servicos$ = this.servicoService.getAllServicos().pipe(
      catchError(err => {
        this.modalError = "Falha ao carregar serviços.";
        return of([]);
      })
    );
  }

  /**
   * Abre o modal de novo agendamento
   */
  openAdminModal(): void {
    // Reseta o formulário
    this.agendamentoForm = {
      clienteId: '',
      petId: '',
      servicoIds: [],
      dataHora: this.getMinDateTime() // Define data/hora padrão
    };
    this.petsDoCliente = [];
    this.modalError = null;
    this.modalLoading = false;
    this.showAdminModal = true;
  }

  /**
   * Fecha o modal
   */
  closeAdminModal(): void {
    if (this.modalLoading) return; // Impede de fechar durante o loading
    this.showAdminModal = false;
  }

  /**
   * Chamado quando o Admin seleciona um cliente no dropdown
   */
  onClienteChange(event: any): void {
    const clienteId = event.target.value;
    if (!clienteId) {
      this.petsDoCliente = [];
      this.agendamentoForm.petId = '';
      return;
    }

    // Busca o cliente específico para pegar a lista de pets dele
    this.clienteService.getClienteById(clienteId).subscribe({
      next: (cliente) => {
        // Assumindo que o 'Cliente' retornado tem um array 'pets'
        this.petsDoCliente = cliente.pets || [];
        this.agendamentoForm.petId = ''; // Reseta a seleção de pet
      },
      error: (err) => {
        console.error('Erro ao buscar pets do cliente', err);
        this.modalError = "Falha ao carregar os pets deste cliente.";
      }
    });
  }

  // === INÍCIO CORREÇÃO (onAdminSubmit) ===
  /**
   * Submete o formulário do modal para criar o agendamento
   */
  onAdminSubmit(): void {
    this.modalLoading = true;
    this.modalError = null;

    // Converte os dados do formulário para o DTO
    // O back-end foi atualizado para aceitar 'clienteId' de um Admin
    const dto: AgendamentoRequestDTO = {
      clienteId: +this.agendamentoForm.clienteId, // Converte string 'id' para number
      petId: +this.agendamentoForm.petId,         // Converte string 'id' para number
      servicoIds: this.agendamentoForm.servicoIds.map(id => +id), // Converte array de strings
      dataHora: new Date(this.agendamentoForm.dataHora).toISOString() // Formata a data
    };

    // Chama o serviço. O back-end agora entende essa requisição.
    this.agendamentoService.createAgendamento(dto).subscribe({
       next: (novoAgendamento) => {
         this.modalLoading = false;
         this.closeAdminModal();
         this.loadAgendamentos(); // Recarrega o calendário
       },
       error: (err: HttpErrorResponse) => {
         this.modalLoading = false;
         // Exibe a mensagem de erro vinda do back-end (ex: "Horário indisponível")
         this.modalError = err.error?.message || "Falha ao criar agendamento.";
         console.error(err);
       }
     });
  }
  // === FIM CORREÇÃO (onAdminSubmit) ===

  /**
   * Helper para definir a data/hora mínima no input (data atual)
   */
  private getMinDateTime(): string {
    const now = new Date();
    // Ajusta para o fuso horário local
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    // Formata para 'yyyy-MM-ddTHH:mm'
    return now.toISOString().slice(0, 16);
  }

  // === FIM SPRINT 04 ===
}