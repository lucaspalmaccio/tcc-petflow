import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
* Guarda funcional (moderno) para proteger as rotas de Admin.
*/
export const adminAuthGuard: CanActivateFn = (route, state) => {
const authService = inject(AuthService);
const router = inject(Router);

// 1. O usuário está logado?
if (!authService.isAuthenticated()) {
    // Não está logado, redireciona para o login
    router.navigate(['/auth/login']);
    return false;
  }

  // 2. O usuário é um ADMIN?
  if (authService.getUserRole() !== 'ROLE_ADMIN') {
    // Está logado, mas não é admin.
    // (Em um sistema maior, redirecionaria para a área do cliente)
    // Por enquanto, apenas o mandamos de volta para o login.
    console.error('Acesso negado. Requer ROLE_ADMIN.');
    authService.logout(); // Desloga o usuário
    return false;
  }

  // Se passou em ambas as verificações, permite o acesso.
  return true;
};