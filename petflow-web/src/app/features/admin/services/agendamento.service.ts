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


getAgendamentosCliente(): Observable<AgendamentoResponse[]> {
  return this.http.get<AgendamentoResponse[]>('http://localhost:8081/api/clientes/me/agendamentos');
}

  // === INÍCIO SPRINT 04 (UC05 - Concluir Agendamento) ===

  /**
   * UC05 - Marca um agendamento como 'CONCLUÍDO'
   * (Consome PATCH /api/agendamentos/{id}/concluir)
   *
   * @param id O ID do agendamento a ser concluído.
   * @returns Um Observable com o agendamento atualizado.
   */
  concluirAgendamento(id: number): Observable<AgendamentoResponse> {
    // O Interceptor de Autenticação (se houver) já deve adicionar
    // o token de ADMIN automaticamente.
    return this.http.patch<AgendamentoResponse>(
      `${this.apiUrl}/${id}/concluir`,
      {} // Envia um corpo vazio, pois é um PATCH sem dados
    );
  }
  // === FIM SPRINT 04 ===
}