import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ClientePerfil {
id: number;
cpf: string;
telefone: string;
endereco: string;
nome: string;
email: string;
usuarioId: number;
}

export interface Pet {
id?: number;
nome: string;
especie: string;
raca: string;
clienteId?: number;
}

export interface AlterarSenha {
senhaAtual: string;
novaSenha: string;
confirmarNovaSenha: string;
}

@Injectable({
providedIn: 'root'
})
export class ClientePerfilService {
private apiUrl = 'http://localhost:8081/api/clientes/me';

constructor(private http: HttpClient) {}

  // 1. Buscar perfil do cliente
  buscarMeuPerfil(): Observable<ClientePerfil> {
    return this.http.get<ClientePerfil>(this.apiUrl);
  }

  // 2. Atualizar perfil do cliente
  atualizarMeuPerfil(perfil: ClientePerfil): Observable<ClientePerfil> {
    return this.http.put<ClientePerfil>(this.apiUrl, perfil);
  }

  // 3. Alterar senha
  alterarSenha(dados: AlterarSenha): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/senha`, dados);
  }

  // 4. Criar pet
  criarPet(pet: Pet): Observable<Pet> {
    return this.http.post<Pet>(`${this.apiUrl}/pets`, pet);
  }

  // 5. Atualizar pet
  atualizarPet(id: number, pet: Pet): Observable<Pet> {
    return this.http.put<Pet>(`${this.apiUrl}/pets/${id}`, pet);
  }

  // 6. Deletar pet
  deletarPet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/pets/${id}`);
  }

  // Listar pets do cliente
  listarMeusPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.apiUrl}/pets`);
  }
}