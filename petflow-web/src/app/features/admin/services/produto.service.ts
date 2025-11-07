import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Produto, ProdutoDTO } from '../models/produto.model';

// === INÍCIO SPRINT 04 ===
/**
* Interface para o DTO de requisição de estoque (UC06)
* Corresponde ao EstoqueRequestDTO.java
*/
export interface EstoqueRequest {
quantidade: number;
}
// === FIM SPRINT 04 ===

@Injectable({
providedIn: 'root'
})
export class ProdutoService {

private apiUrl = `${environment.apiUrl}/api/produtos`;

constructor(private http: HttpClient) { }

  /**
   * UC04 - Listar Produtos
   */
  getAllProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  /**
   * UC04 - Buscar Produto por ID
   */
  getProdutoById(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  /**
   * UC04 - Adicionar Produto
   */
  createProduto(produto: ProdutoDTO): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto);
  }

  /**
   * UC04 - Editar Produto
   */
  updateProduto(id: number, produto: ProdutoDTO): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto);
  }

  /**
   * UC04 - Excluir Produto
   */
  deleteProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // === INÍCIO SPRINT 04 (UC06 - Entrada Manual) ===

  /**
   * UC06 - Adiciona uma quantidade ao estoque de um produto
   * (Consome PATCH /api/produtos/{id}/adicionar-estoque)
   */
  adicionarEstoque(id: number, quantidade: number): Observable<Produto> {
    const body: EstoqueRequest = { quantidade: quantidade };
    return this.http.patch<Produto>(`${this.apiUrl}/${id}/adicionar-estoque`, body);
  }
  // === FIM SPRINT 04 ===
}