import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DashboardResponse } from '../models/financeiro.model'; // Vamos criar este model

@Injectable({
providedIn: 'root'
})
export class FinanceiroService {

private apiUrl = `${environment.apiUrl}/api/financeiro`;

constructor(private http: HttpClient) { }

  /**
   * UC08 - Busca os dados do Dashboard Financeiro
   * (Consome GET /api/financeiro/dashboard)
   *
   * @returns Um Observable com os dados do dashboard.
   */
  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.apiUrl}/dashboard`);
  }
}