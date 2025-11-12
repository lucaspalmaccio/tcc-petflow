import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { AgendamentoService } from '../../../admin/services/agendamento.service';
import { AgendamentoResponse } from '../../../admin/models/agendamento.model';
import { PetService } from '../../../admin/services/pet.service';
import { ServicoService } from '../../../admin/services/servico.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
selector: 'app-meus-agendamentos',
templateUrl: './meus-agendamentos.component.html',
styleUrls: ['./meus-agendamentos.component.css']
})
export class MeusAgendamentosComponent implements OnInit {

// Observables
public agendamentos$: Observable<AgendamentoResponse[]> = of([]);
public petsCliente$: Observable<any[]> = of([]);
public servicosDisponiveis$: Observable<any[]> = of([]);

// Estados
public isLoadingAgendamentos = true;
public errorAgendamentos: string | null = null;
public isModalOpen = false;
public isLoadingModalData = false;

constructor(
    private agendamentoService: AgendamentoService,
    private petService: PetService,
    private servicoService: ServicoService,
    private authService: AuthService,
    private router: Router
  ) {
    console.log('🏗️ MeusAgendamentosComponent construído');
  }

  ngOnInit(): void {
    console.log('🚀 Componente MeusAgendamentos inicializado');
    this.loadAgendamentos();
  }

  /**
   * Carrega agendamentos do cliente logado
   */
  loadAgendamentos(): void {
    console.log('📋 Carregando agendamentos...');

    this.isLoadingAgendamentos = true;
    this.errorAgendamentos = null;

    this.agendamentos$ = this.agendamentoService.getAgendamentosCliente().pipe(
      tap({
        next: (agendamentos) => {
          console.log('✅ Agendamentos carregados com sucesso:', agendamentos);
          console.log('📊 Total:', agendamentos.length);

          if (agendamentos.length === 0) {
            console.log('⚠️ Nenhum agendamento encontrado');
          } else {
            agendamentos.forEach((ag, index) => {
              console.log(`   ${index + 1}. ID: ${ag.id} | Data: ${ag.dataHora} | Status: ${ag.status}`);
            });
          }
        },
        error: (err) => {
          console.error('❌ Erro ao carregar agendamentos:', err);
          console.error('Status:', err.status);
          console.error('Mensagem:', err.message);
          console.error('URL:', err.url);
        }
      }),
      catchError((err) => {
        this.errorAgendamentos = 'Erro ao carregar agendamentos. Tente novamente.';
        console.error('💥 Erro capturado:', err);
        return of([]);
      }),
      finalize(() => {
        this.isLoadingAgendamentos = false;
        console.log('🏁 Finalizado carregamento de agendamentos');
      })
    );
  }

  /**
   * Método para formatar serviços
   */
  getServicosString(agendamento: AgendamentoResponse): string {
    if (!agendamento.servicos || agendamento.servicos.length === 0) {
      return 'Nenhum serviço';
    }
    return agendamento.servicos.map(s => s.nome).join(', ');
  }

  /**
   * Navega para a página de Meu Perfil
   */
  irParaPerfil(): void {
    console.log('👤 Navegando para Meu Perfil');
    this.router.navigate(['/cliente/perfil']);
  }

  /**
   * Abre modal de novo agendamento
   */
  openAgendamentoModal(): void {
    console.log('🔓 Preparando para abrir modal de novo agendamento');
    this.isLoadingModalData = true;

    // Carrega os pets do cliente
    this.petsCliente$ = this.petService.getMeusPets().pipe(
      tap((pets: any[]) => {
        console.log('🐾 Pets carregados:', pets);
        console.log('📊 Total de pets:', pets.length);
      }),
      catchError(err => {
        console.error('❌ Erro ao carregar pets:', err);
        alert('Erro ao carregar seus pets. Verifique se você tem pets cadastrados no seu perfil.');
        return of([]);
      })
    );

    // Carrega os serviços disponíveis
    this.servicosDisponiveis$ = this.servicoService.getAllServicos().pipe(
      tap((servicos: any[]) => {
        console.log('💼 Serviços carregados:', servicos);
        console.log('📊 Total de serviços:', servicos.length);
      }),
      catchError(err => {
        console.error('❌ Erro ao carregar serviços:', err);
        alert('Erro ao carregar serviços disponíveis.');
        return of([]);
      })
    );

    // Abre o modal
    this.isLoadingModalData = false;
    this.isModalOpen = true;
    console.log('✅ Modal aberto');
  }

  /** Fecha modal */
  closeAgendamentoModal(): void {
    console.log('🔒 Fechando modal');
    this.isModalOpen = false;
  }

  /** Após salvar novo agendamento */
  handleSaveSuccess(): void {
    console.log('💾 Agendamento salvo! Recarregando lista...');
    this.isModalOpen = false;
    this.loadAgendamentos();
  }

  /** Cancelar agendamento */
  onCancel(id: number, data: string): void {
    if (confirm(`Tem certeza que deseja cancelar o agendamento do dia ${data}?`)) {
      console.log(`🗑️ Cancelando agendamento ID: ${id}`);

      this.agendamentoService.cancelarAgendamento(id).subscribe({
        next: () => {
          console.log('✅ Agendamento cancelado com sucesso');
          this.loadAgendamentos();
        },
        error: (err) => {
          console.error('❌ Erro ao cancelar:', err);
          alert('Erro ao cancelar agendamento.');
        }
      });
    }
  }

  /** Formata a data para exibição */
  formatDate(dataHora: string): string {
    try {
      return new Date(dataHora).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return dataHora;
    }
  }

  /** Logout do cliente */
  logout(): void {
    console.log('👋 Fazendo logout...');
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}