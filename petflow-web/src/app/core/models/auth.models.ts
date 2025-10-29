export type Perfil = 'ADMIN' | 'CLIENTE';

export interface LoginResponse {
    token: string;
expiresIn: number;
userName: string;
userRole: Perfil;
}

export interface LoginRequest {
email: string;
senhaNormal: string;
}
