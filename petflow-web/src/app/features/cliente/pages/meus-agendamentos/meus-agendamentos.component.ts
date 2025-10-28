import { Component, OnInit } from '@angular/core';
import { Observable, Subject, switchMap, catchError, of, tap } from 'rxjs';
import { AgendamentoService } from '../../../admin/services/agendamento.service';
import { AgendamentoResponse } from '../../../admin/models/agendamento.model';
import { PetService } from '../../../admin/services/pet.service';
import { ServicoService } from '../../../admin/services/servico.service';
import { Pet } from '../../../admin/models/pet.model';
import { Servico } from '../../../admin/models/servico.model';

@Component({
selector: 'app-meus-agendamentos',
templateUrl: './meus-agendamentos.component.html',
styleUrls: ['./meus-agendamentos.component.css']
})
export class MeusAgendamentosComponent implements OnInit {

// Agendamentos existentes
public agendamentos$!: Observable<AgendamentoResponse[]>;
public isLoadingAgendamentos = true;
public errorAgendamentos: string | null = null;

// Troca BehaviorSubject por Subject (sem valor inicial)
private refreshAgendamentos = new Subject<void>(); // Para recarregar a lista

// Dados para o modal
public petsCliente$!: Observable<Pet[]>;
public servicosDisponiveis$!: Observable<Servico[]>;
public isLoadingModalData = false;

// Estado do Modal
public isModalOpen = false;

constructor(
    private agendamentoService: AgendamentoService,
    private petService: PetService,
    private servicoService: ServicoService
  ) {}

  ngOnInit(): void {
    // Carrega a lista de agendamentos e reage a atualizações
    this.agendamentos$ = this.refreshAgendamentos.pipe(
      switchMap(() => {
        this.isLoadingAgendamentos = true;
        this.errorAgendamentos = null;
        return this.agendamentoService.getAgendamentos().pipe(
          catchError((err) => {
            this.isLoadingAgendamentos = false;
            this.errorAgendamentos = "Falha ao carregar seus agendamentos.";
            console.error(err);
            return of([]); // Retorna array vazio em caso de erro
          })
        );
      }),
      tap(() => this.isLoadingAgendamentos = false)
    );

    // Dispara o primeiro carregamento manualmente
    this.loadAgendamentos();

    // Carrega dados do modal apenas uma vez
    this.loadModalData();
  }

  /** UC05 - Carrega a lista de agendamentos do cliente logado. */
  loadAgendamentos(): void {
    this.refreshAgendamentos.next(); // Emite para recarregar a lista
  }

  /** Carrega os dados necessários para o modal (pets e serviços) */
  loadModalData(): void {
    this.isLoadingModalData = true;

    this.petsCliente$ = this.petService.getMeusPets().pipe(
      catchError(err => {
        console.error("Erro ao buscar pets:", err);
        return of([]);
      })
    );

    this.servicosDisponiveis$ = this.servicoService.getAllServicos().pipe(
      catchError(err => {
        console.error("Erro ao buscar serviços:", err);
        return of([]);
      }),
      tap(() => this.isLoadingModalData = false)
    );

    // Apenas dispara para iniciar os requests
    this.petsCliente$.subscribe();
    this.servicosDisponiveis$.subscribe();
  }

  /** CT03.4 - Cancelar Agendamento */
  onCancel(id: number, data: string): void {
    const dataFormatada = new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    if (confirm(`Tem certeza que deseja cancelar o agendamento do dia ${dataFormatada}?`)) {
      this.agendamentoService.cancelarAgendamento(id).subscribe({
        next: () => this.loadAgendamentos(),
        error: (err) => alert("Erro ao cancelar agendamento: " + (err.error?.erro || err.message))
      });
    }
  }

  /** UC05 - Abre o modal de novo agendamento */
  openAgendamentoModal(): void {
    this.loadModalData();
    this.isModalOpen = true;
  }

  closeAgendamentoModal(): void {
    this.isModalOpen = false;
  }

  /** Evento emitido pelo modal quando o agendamento é salvo com sucesso */
  handleSaveSuccess(): void {
    this.isModalOpen = false;
    this.loadAgendamentos();
  }

  /** Helper para formatar data no template */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  /** Helper para exibir lista de serviços em formato de string */
  getServicosString(ag: AgendamentoResponse): string {
    return (ag.servicos || [])
      .filter(s => !!s)
      .map(s => s.nome)
      .join(', ') || 'Nenhum';
  }
}
