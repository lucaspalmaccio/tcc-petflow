/**
* Interface que espelha o LoginResponseDTO do back-end.
* Usada para tipar a resposta do login.
*/
export interface LoginResponse {
    token: string;
expiresIn: number;
userName: string;
userRole: string; // "ROLE_ADMIN" ou "ROLE_CLIENTE"
}
