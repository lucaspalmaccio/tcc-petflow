import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Cliente, CreateClienteDTO, UpdateClienteDTO } from '../models/cliente.model';

@Injectable({
providedIn: 'root' // Disponível em todo o módulo Admin
})
export class ClienteService {

private readonly apiUrl: string;

constructor(private http: HttpClient) {
    // 🔧 Corrige automaticamente se houver espaços, quebras de linha ou barras duplas
    this.apiUrl = `${environment.apiUrl}`.trim().replace(/\/+$/, '') + '/api/clientes';
    console.log('✅ API URL configurada:', this.apiUrl);
  }

  /**
   * UC02 - Listar Clientes
   */
  getAllClientes(): Observable<Cliente[]> {
    console.log('📤 GET ->', this.apiUrl);
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  /**
   * UC02 - Buscar Cliente por ID
   */
  getClienteById(id: number): Observable<Cliente> {
    const url = `${this.apiUrl}/${id}`;
    console.log('📤 GET ->', url);
    return this.http.get<Cliente>(url);
  }

  /**
   * UC02 - Adicionar Cliente
   */
  createCliente(cliente: CreateClienteDTO): Observable<Cliente> {
    console.log('📤 POST ->', this.apiUrl, cliente);
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  /**
   * UC02 - Editar Cliente
   */
  updateCliente(id: number, cliente: UpdateClienteDTO): Observable<Cliente> {
    const url = `${this.apiUrl}/${id}`;
    console.log('📤 PUT ->', url, cliente);
    return this.http.put<Cliente>(url, cliente);
  }

  /**
   * UC02 - Excluir Cliente
   */
  deleteCliente(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    console.log('📤 DELETE ->', url);
    return this.http.delete<void>(url);
  }
}
