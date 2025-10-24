import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponse } from '../models/auth.models';

// Chaves para o localStorage
const AUTH_TOKEN_KEY = 'petflow_auth_token';
const USER_ROLE_KEY = 'petflow_user_role';
const USER_NAME_KEY = 'petflow_user_name';

@Injectable({
providedIn: 'root' // Disponível globalmente
})
export class AuthService {

private apiUrl = `${environment.apiUrl}/auth`;

constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  /**
   * UC01 - Autenticar Usuário
   * Chama a API de login e armazena o token se for bem-sucedido.
   */
  login(email: string, senha: string): Observable<LoginResponse | null> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, senha })
      .pipe(
        tap((response) => this.setSession(response)),
        catchError((error) => {
          console.error("Erro no login:", error);
          this.clearSession(); // Garante que qualquer sessão antiga seja limpa
          return of(null); // Retorna um observable nulo em caso de erro
        })
      );
  }

  /**
   * Salva os dados da sessão no localStorage.
   */
  private setSession(authResponse: LoginResponse): void {
    localStorage.setItem(AUTH_TOKEN_KEY, authResponse.token);
    localStorage.setItem(USER_ROLE_KEY, authResponse.userRole);
    localStorage.setItem(USER_NAME_KEY, authResponse.userName);
  }

  /**
   * Limpa a sessão do localStorage e redireciona para o login.
   */
  logout(): void {
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  private clearSession(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    localStorage.removeItem(USER_NAME_KEY);
  }

  // --- Métodos utilitários ---

  /**
   * Retorna o token JWT armazenado.
   */
  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  /**
   * Verifica se o usuário está autenticado (possui um token).
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Retorna o perfil (ROLE) do usuário logado.
   */
  getUserRole(): string | null {
    return localStorage.getItem(USER_ROLE_KEY);
  }

  /**
   * Retorna o nome do usuário logado.
   */
  getUserName(): string | null {
    return localStorage.getItem(USER_NAME_KEY);
  }
}