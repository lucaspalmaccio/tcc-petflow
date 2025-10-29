import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, Perfil } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
const authService = inject(AuthService);
const router = inject(Router);

if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  const expectedRoles = route.data?.['roles'] as Perfil[] | undefined;
  const userRole = authService.getUserRole();

  if (expectedRoles && (!userRole || !expectedRoles.includes(userRole))) {
    console.error('Acesso negado: perfil não permitido.');
    authService.logout();
    return false;
  }

  return true;
};
