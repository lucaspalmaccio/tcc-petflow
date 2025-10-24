import { Component, OnInit } from '@angular/core';
import { AgendamentoService } from '../../../admin/services/agendamento.service';
import { AgendamentoResponse } from '../../../admin/models/agendamento.model';

// Imports do Calendário
import { CalendarEvent, CalendarEventAction, CalendarView } from 'angular-calendar';
import {
startOfDay,
endOfDay,
subDays,
addDays,
endOfMonth,
isSameDay,
isSameMonth,
addHours,
startOfMonth,
endOfWeek,
startOfWeek,
} from 'date-fns';
import { Subject } from 'rxjs';

// Cores para os status (Exemplo)
const colors: any = {
AGENDADO: {
primary: '#007bff', // Azul
secondary: '#D1E7FD',
},
CONCLUIDO: {
primary: '#198754', // Verde
secondary: '#D1FAD0',
},
CANCELADO: {
primary: '#6c757d', // Cinza
secondary: '#E2E3E5',
},
};

@Component({
selector: 'app-agenda',
templateUrl: './agenda.component.html',
styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {

// --- Configuração do Calendário ---
view: CalendarView = CalendarView.Month; // Visão de Mês
CalendarView = CalendarView; // Para usar no HTML
viewDate: Date = new Date(); // Data atual
locale: string = 'pt'; // Define o idioma para "pt-BR"
events: CalendarEvent[] = [];
isLoading = true;
refresh = new Subject<void>();

constructor(private agendamentoService: AgendamentoService) { }

  ngOnInit(): void {
    this.loadAgendamentos();
  }

  /**
   * Carrega os agendamentos do back-end
   * UC05 - Visão do Administrador (calendário)
   */
  loadAgendamentos(): void {
    this.isLoading = true;

    // Calcula o início e o fim do mês visível
    const inicio = startOfWeek(startOfMonth(this.viewDate));
    const fim = endOfWeek(endOfMonth(this.viewDate));

    // Busca na API
    this.agendamentoService.getAgendamentos(
      inicio.toISOString(),
      fim.toISOString()
    ).subscribe(data => {
      // Converte a resposta da API para o formato do Calendário
      this.events = data.map((ag: AgendamentoResponse) => {
        return {
          id: ag.id,
          start: new Date(ag.dataHora),
          title: `(${ag.status.substring(0, 3)}) ${ag.pet.nome} - ${ag.servicos.map(s => s.nome).join(', ')}`,
          color: colors[ag.status] || colors.CANCELADO,
          allDay: false, // Eventos têm hora marcada
        };
      });
      this.isLoading = false;
      this.refresh.next(); // Atualiza a view do calendário
    });
  }

  /**
   * Chamado quando o usuário troca de mês ou dia.
   */
  onViewDateChange(): void {
    this.loadAgendamentos();
  }

  /**
   * Chamado quando o usuário troca a visão (Mês, Semana, Dia).
   */
  setView(view: CalendarView): void {
    this.view = view;
  }
}
