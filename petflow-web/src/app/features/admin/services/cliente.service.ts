import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Cliente, CreateClienteDTO, UpdateClienteDTO } from '../models/cliente.model';

@Injectable({
providedIn: 'root' // Disponível em todo o módulo Admin
})
export class ClienteService {

private apiUrl = `${environment.apiUrl}/api/clientes`;

constructor(private http: HttpClient) { }

  /**
   * UC02 - Listar Clientes
   */
  getAllClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  /**
   * UC02 - Buscar Cliente por ID
   */
  getClienteById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  /**
   * UC02 - Adicionar Cliente
   */
  createCliente(cliente: CreateClienteDTO): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  /**
   * UC02 - Editar Cliente
   */
  updateCliente(id: number, cliente: UpdateClienteDTO): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente);
  }

  /**
   * UC02 - Excluir Cliente
   */
  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}