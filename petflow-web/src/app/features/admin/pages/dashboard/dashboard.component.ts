import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { FinanceiroService } from '../../services/financeiro.service';
import { DashboardResponse } from '../../models/financeiro.model';

@Component({
selector: 'app-dashboard',
templateUrl: './dashboard.component.html',
styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

// Usamos o '$' para indicar que é um Observable
dashboardData$!: Observable<DashboardResponse>;

// Subject para tratar a mensagem de erro
private errorSubject = new Subject<string>();
errorMessage$ = this.errorSubject.asObservable();

isLoading = true; // Para o feedback de "Carregando..."

constructor(private financeiroService: FinanceiroService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorSubject.next(''); // Limpa erros antigos

    this.dashboardData$ = this.financeiroService.getDashboard().pipe(
      tap(() => {
        this.isLoading = false; // Desliga o loading em caso de sucesso
      }),
      catchError(err => {
        // Em caso de erro (ex: 403 Forbidden se o token estiver errado)
        console.error('Erro ao buscar dados do dashboard', err);
        this.errorSubject.next('Não foi possível carregar os dados do dashboard. Verifique sua permissão.');
        this.isLoading = false; // Desliga o loading
        return new Observable<DashboardResponse>(); // Retorna um observable vazio para não quebrar a stream
      })
    );
  }
}