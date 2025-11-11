import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AgendamentoService } from '../../../admin/services/agendamento.service';
import { AgendamentoResponse } from '../../../admin/models/agendamento.model';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
selector: 'app-meus-agendamentos',
templateUrl: './meus-agendamentos.component.html',
styleUrls: ['./meus-agendamentos.component.css']
})
export class MeusAgendamentosComponent implements OnInit {

public agendamentos$: Observable<AgendamentoResponse[]>;
public isLoadingAgendamentos = true;
public errorAgendamentos: string | null = null;

// Modal de novo agendamento
public isModalOpen = false;
public isLoadingModalData = false;

constructor(
    private agendamentoService: AgendamentoService,
    private authService: AuthService,
    private router: Router
  ) {
    console.log('🏗️ MeusAgendamentosComponent construído');
  }

  ngOnInit(): void {
    console.log('🚀 ngOnInit - Iniciando componente');
    this.loadAgendamentos();
  }

  /** Carrega agendamentos do cliente logado */
  loadAgendamentos(): void {
    console.log('📋 loadAgendamentos() chamado');
    this.isLoadingAgendamentos = true;
    this.errorAgendamentos = null;

    // IMPORTANTE: Use getAgendamentosCliente() ao invés de getAgendamentos()
    this.agendamentos$ = this.agendamentoService.getAgendamentosCliente().pipe(
      tap({
        next: (data) => {
          console.log('✅ Dados recebidos com sucesso:', data);
          console.log('📊 Quantidade de agendamentos:', data.length);
          this.isLoadingAgendamentos = false;
        },
        error: (err) => {
          console.error('❌ ERRO ao carregar agendamentos:');
          console.error('Status:', err.status);
          console.error('Status Text:', err.statusText);
          console.error('URL:', err.url);
          console.error('Mensagem:', err.message);
          console.error('Error completo:', err);

          this.isLoadingAgendamentos = false;
          this.errorAgendamentos = `Falha ao carregar agendamentos. Status: ${err.status}`;
        }
      })
    );
  }

  /** Abre modal de novo agendamento */
  openAgendamentoModal(): void {
    console.log('🔓 Abrindo modal de agendamento');
    this.isModalOpen = true;
  }

  /** Fecha modal */
  closeAgendamentoModal(): void {
    console.log('🔒 Fechando modal de agendamento');
    this.isModalOpen = false;
  }

  /** Após salvar novo agendamento */
  handleSaveSuccess(): void {
    console.log('💾 Agendamento salvo com sucesso');
    this.isModalOpen = false;
    this.loadAgendamentos();
  }

  /** Cancelar agendamento */
  onCancel(id: number, data: string): void {
    if (confirm(`Tem certeza que deseja cancelar o agendamento do dia ${data}?`)) {
      console.log(`🗑️ Cancelando agendamento ID: ${id}`);
      this.agendamentoService.cancelarAgendamento(id).subscribe({
        next: () => {
          console.log('✅ Agendamento cancelado');
          this.loadAgendamentos();
        },
        error: (err) => {
          console.error('❌ Erro ao cancelar:', err);
          alert("Erro ao cancelar agendamento.");
        }
      });
    }
  }

  /** Formata a data para exibição */
  formatDate(dataHora: string): string {
    return new Date(dataHora).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  }

  /** Logout do cliente */
  logout(): void {
    console.log('👋 Logout do cliente');
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}