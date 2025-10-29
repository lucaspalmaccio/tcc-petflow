import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// Enum de perfis
export enum Perfil {
ADMIN = 'ADMIN',
CLIENTE = 'CLIENTE'
}

// Interface da resposta do backend
export interface LoginResponse {
token: string | null;
expiresIn: number | null;
userName: string | null;
userRole: Perfil | null;
email?: string | null;  // ← ADICIONAR email na resposta
}

@Injectable({
providedIn: 'root'
})
export class AuthService {
private apiUrl = 'http://localhost:8081/auth';

// BehaviorSubject para estado de autenticação reativo
private currentUserRoleSubject: BehaviorSubject<Perfil | null>;
public currentUserRole$: Observable<Perfil | null>;

private currentUserNameSubject: BehaviorSubject<string | null>;
public currentUserName$: Observable<string | null>;

constructor(private router: Router, private http: HttpClient) {
        // Inicializa os BehaviorSubjects com os dados do localStorage
        this.currentUserRoleSubject = new BehaviorSubject<Perfil | null>(this.getUserRoleFromStorage());
        this.currentUserNameSubject = new BehaviorSubject<string | null>(this.getUserNameFromStorage());

        this.currentUserRole$ = this.currentUserRoleSubject.asObservable();
        this.currentUserName$ = this.currentUserNameSubject.asObservable();
    }

    // Método de login usando snake_case 'senha_normal' para match com o backend
    login(email: string, senha_normal: string): Observable<LoginResponse> {
        // Envia 'senha_normal' em snake_case
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, senha_normal })
            .pipe(
                tap(response => {
                    if (!response.userRole) {
                        throw new Error('Usuário ou senha inválidos');
                    }
                    // ← SALVA O EMAIL TAMBÉM
                    this.setSession(response, email);
                }),
                catchError(err => {
                    console.error('Erro no login', err);
                    return throwError(() => new Error('Usuário ou senha inválidos'));
                })
            );
    }

    // ← MODIFICADO: Agora recebe o email como parâmetro
    private setSession(authResponse: LoginResponse, email: string): void {
        // ← SALVA O EMAIL COMO TOKEN (solução temporária sem JWT)
        localStorage.setItem('petflow_auth_token', email);
        localStorage.setItem('petflow_user_email', email);
        localStorage.setItem('petflow_user_role', authResponse.userRole ?? '');
        localStorage.setItem('petflow_user_name', authResponse.userName ?? '');

        if (authResponse.expiresIn) {
            const expiresAt = Date.now() + authResponse.expiresIn * 1000;
            localStorage.setItem('petflow_token_expires', expiresAt.toString());
        }

        // Notifica os assinantes sobre a mudança de estado
        this.currentUserRoleSubject.next(authResponse.userRole);
        this.currentUserNameSubject.next(authResponse.userName);
    }

    logout(): void {
        localStorage.clear();

        // Notifica os assinantes sobre o logout
        this.currentUserRoleSubject.next(null);
        this.currentUserNameSubject.next(null);

        this.router.navigate(['/auth/login']);
    }

    getToken(): string | null {
        return localStorage.getItem('petflow_auth_token');
    }

    // ← NOVO: Método para pegar o email
    getUserEmail(): string | null {
        return localStorage.getItem('petflow_user_email');
    }

    // Renomeado para evitar confusão com o getter público
    private getUserRoleFromStorage(): Perfil | null {
        return localStorage.getItem('petflow_user_role') as Perfil;
    }

    // Renomeado para evitar confusão
    private getUserNameFromStorage(): string | null {
        return localStorage.getItem('petflow_user_name');
    }

    // Getter público para o valor atual (não reativo)
    public getUserRole(): Perfil | null {
        return this.currentUserRoleSubject.value;
    }

    // Getter público para o valor atual (não reativo)
    public getUserName(): string | null {
        return this.currentUserNameSubject.value;
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        const expires = localStorage.getItem('petflow_token_expires');
        if (!token) return false;

        // Se não houver tempo de expiração, considere válido (embora não seja ideal)
        if (!expires) return true;

        if (Date.now() > Number(expires)) {
            this.logout(); // Limpa a sessão expirada
            return false;
        }
        return true;
    }
}