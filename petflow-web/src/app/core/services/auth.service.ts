import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

// Enum de perfis
export enum Perfil {
ADMIN = 'ADMIN',
CLIENTE = 'CLIENTE'
}

// Interface da resposta do BACKEND (como vem da API)
interface BackendLoginResponse {
token: string;
expiresIn: number;
email: string;
perfil: string;  // Backend retorna "perfil", não "userRole"
}

// Interface da resposta TRATADA (para o componente)
export interface LoginResponse {
token: string | null;
expiresIn: number | null;
userName: string | null;
userRole: Perfil | null;
email?: string | null;
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
        this.currentUserRoleSubject = new BehaviorSubject<Perfil | null>(this.getUserRoleFromStorage());
        this.currentUserNameSubject = new BehaviorSubject<string | null>(this.getUserNameFromStorage());

        this.currentUserRole$ = this.currentUserRoleSubject.asObservable();
        this.currentUserName$ = this.currentUserNameSubject.asObservable();
    }

    // ✅ CORRIGIDO: Recebe um objeto com { email, senha }
    login(credentials: { email: string; senha: string }): Observable<LoginResponse> {
        console.log('📤 AuthService enviando:', credentials);

        return this.http.post<BackendLoginResponse>(`${this.apiUrl}/login`, credentials)
            .pipe(
                map(response => {
                    console.log('📥 Backend respondeu:', response);

                    // Transforma "perfil" em "userRole"
                    const transformedResponse: LoginResponse = {
                        token: response.token,
                        expiresIn: response.expiresIn,
                        email: response.email,
                        userName: response.email.split('@')[0], // Usa email como userName
                        userRole: response.perfil as Perfil  // CONVERTE "perfil" → "userRole"
                    };

                    console.log('✅ Response transformada:', transformedResponse);
                    return transformedResponse;
                }),
                tap(response => {
                    if (!response.userRole) {
                        throw new Error('Usuário ou senha inválidos');
                    }
                    this.setSession(response);
                }),
                catchError(err => {
                    console.error('❌ Erro no login', err);
                    return throwError(() => new Error('Usuário ou senha inválidos'));
                })
            );
    }

    // Não precisa mais do parâmetro email
    private setSession(authResponse: LoginResponse): void {
        localStorage.setItem('petflow_auth_token', authResponse.token ?? '');
        localStorage.setItem('petflow_user_email', authResponse.email ?? '');
        localStorage.setItem('petflow_user_role', authResponse.userRole ?? '');
        localStorage.setItem('petflow_user_name', authResponse.userName ?? '');

        if (authResponse.expiresIn) {
            const expiresAt = Date.now() + authResponse.expiresIn;
            localStorage.setItem('petflow_token_expires', expiresAt.toString());
        }

        // Notifica os assinantes
        this.currentUserRoleSubject.next(authResponse.userRole);
        this.currentUserNameSubject.next(authResponse.userName);
    }

    logout(): void {
        localStorage.clear();
        this.currentUserRoleSubject.next(null);
        this.currentUserNameSubject.next(null);
        this.router.navigate(['/auth/login']);
    }

    getToken(): string | null {
        return localStorage.getItem('petflow_auth_token');
    }

    getUserEmail(): string | null {
        return localStorage.getItem('petflow_user_email');
    }

    private getUserRoleFromStorage(): Perfil | null {
        return localStorage.getItem('petflow_user_role') as Perfil;
    }

    private getUserNameFromStorage(): string | null {
        return localStorage.getItem('petflow_user_name');
    }

    public getUserRole(): Perfil | null {
        return this.currentUserRoleSubject.value;
    }

    public getUserName(): string | null {
        return this.currentUserNameSubject.value;
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        const expires = localStorage.getItem('petflow_token_expires');
        if (!token) return false;
        if (!expires) return true;

        if (Date.now() > Number(expires)) {
            this.logout();
            return false;
        }
        return true;
    }
}