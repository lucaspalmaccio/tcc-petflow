import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminAuthGuard } from './core/guards/auth.guard'; // Importa o Guarda

const routes: Routes = [
{
path: '',
redirectTo: '/admin', // Redireciona a raiz para o painel de admin
pathMatch: 'full'
},
{
// Módulo de Autenticação (Login) - Carregamento lento (lazy loading)
path: 'auth',
loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    // Módulo de Admin (Clientes, Pets, etc.) - Carregamento lento
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [adminAuthGuard] // <--- A ROTA ESTÁ PROTEGIDA!
  },
  {
    // Rota curinga: Se não encontrar a página, volta ao login
    path: '**',
    redirectTo: '/auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }