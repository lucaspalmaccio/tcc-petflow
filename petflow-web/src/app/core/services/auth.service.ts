import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoginResponse } from '../models/auth.models';

const AUTH_TOKEN_KEY = 'petflow_auth_token';
const USER_ROLE_KEY = 'petflow_user_role';
const USER_NAME_KEY = 'petflow_user_name';

@Injectable({
providedIn: 'root'
})
export class AuthService {

constructor(private router: Router) {}

  /**
   * Simula o login do usuário (modo de testes).
   * Qualquer email/senha funciona.
   */
  login(email: string, senha: string): Observable<LoginResponse | null> {
    console.log('🔓 [MODO TESTE] Login simulado:', email);

const fakeResponse: LoginResponse = {
  token: 'fake-jwt-token',
  userRole: 'ROLE_ADMIN',
  userName: 'Usuário Teste',
  expiresIn: 999999 // ou qualquer número, ex: tempo de expiração fake
};

    this.setSession(fakeResponse);
    return of(fakeResponse);
  }

  /**
   * Armazena dados falsos no localStorage (simulando login real).
   */
  private setSession(authResponse: LoginResponse): void {
    localStorage.setItem(AUTH_TOKEN_KEY, authResponse.token ?? '');
    localStorage.setItem(USER_ROLE_KEY, authResponse.userRole ?? '');
    localStorage.setItem(USER_NAME_KEY, authResponse.userName ?? '');
  }

  /**
   * Faz logout limpando o localStorage e redirecionando para a tela de login.
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

  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    // sempre retorna true (modo teste)
    return true;
  }

  getUserRole(): string | null {
    return localStorage.getItem(USER_ROLE_KEY) ?? 'ADMIN';
  }

  getUserName(): string | null {
    return localStorage.getItem(USER_NAME_KEY) ?? 'Usuário Teste';
  }
}
