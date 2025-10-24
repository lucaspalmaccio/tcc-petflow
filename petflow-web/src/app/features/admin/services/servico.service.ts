import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Servico, ServicoDTO } from '../models/servico.model';

@Injectable({
providedIn: 'root'
})
export class ServicoService {

private apiUrl = `${environment.apiUrl}/api/servicos`;

constructor(private http: HttpClient) { }

  /**
   * UC04 - Listar Serviços
   */
  getAllServicos(): Observable<Servico[]> {
    return this.http.get<Servico[]>(this.apiUrl);
  }

  /**
   * UC04 - Buscar Serviço por ID
   */
  getServicoById(id: number): Observable<Servico> {
    return this.http.get<Servico>(`${this.apiUrl}/${id}`);
  }

  /**
   * UC04 - Adicionar Serviço
   */
  createServico(servico: ServicoDTO): Observable<Servico> {
    return this.http.post<Servico>(this.apiUrl, servico);
  }

  /**
   * UC04 - Editar Serviço
   */
  updateServico(id: number, servico: ServicoDTO): Observable<Servico> {
    return this.http.put<Servico>(`${this.apiUrl}/${id}`, servico);
  }

  /**
   * UC04 - Excluir Serviço
   */
  deleteServico(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}