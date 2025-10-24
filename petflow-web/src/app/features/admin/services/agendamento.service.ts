import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AgendamentoRequestDTO, AgendamentoResponse } from '../models/agendamento.model';

@Injectable({
providedIn: 'root'
})
export class AgendamentoService {

private apiUrl = `${environment.apiUrl}/api/agendamentos`;

constructor(private http: HttpClient) { }

  /**
   * UC05 - Criar Agendamento (Usado pelo Cliente e Admin)
   */
  createAgendamento(dto: AgendamentoRequestDTO): Observable<AgendamentoResponse> {
    return this.http.post<AgendamentoResponse>(this.apiUrl, dto);
  }

  /**
   * UC05 - Listar Agendamentos (para Cliente ou Admin)
   * O back-end filtra automaticamente com base no perfil (ROLE) do token.
   */
  getAgendamentos(inicio?: string, fim?: string): Observable<AgendamentoResponse[]> {
    let params = new HttpParams();
    if (inicio) {
      params = params.set('inicio', inicio);
    }
    if (fim) {
      params = params.set('fim', fim);
    }
    return this.http.get<AgendamentoResponse[]>(this.apiUrl, { params });
  }

  /**
   * CT03.4 - Cancelar Agendamento
   */
  cancelarAgendamento(id: number): Observable<AgendamentoResponse> {
    return this.http.patch<AgendamentoResponse>(`${this.apiUrl}/${id}/cancelar`, {});
  }
}
