import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
* Guarda funcional para proteger as rotas do Cliente.
*/
export const clienteAuthGuard: CanActivateFn = (route, state) => {
const authService = inject(AuthService);
const router = inject(Router);

// 1. O usuário está logado?
if (!authService.isAuthenticated()) {
    // Não está logado, redireciona para o login
    router.navigate(['/auth/login']);
    return false;
  }

  // 2. O usuário é um CLIENTE?
  // (Permitimos ADMIN também, caso ele precise acessar a visão do cliente)
  const role = authService.getUserRole();
  if (role === 'ROLE_CLIENTE' || role === 'ROLE_ADMIN') {
    return true; // Permite acesso
  }

  // Se não for nenhum dos dois, nega o acesso.
  console.error('Acesso negado. Requer ROLE_CLIENTE ou ROLE_ADMIN.');
  authService.logout(); // Desloga o usuário
  return false;
};