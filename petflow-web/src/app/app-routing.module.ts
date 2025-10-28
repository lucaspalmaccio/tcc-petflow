import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminAuthGuard } from './core/guards/auth.guard';
import { clienteAuthGuard } from './core/guards/cliente.guard';
import { CadastrarAdminComponent } from './features/admin/pages/cadastrar-admin/cadastrar-admin.component'; // ✅ ajuste o caminho conforme seu projeto
const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    // Módulo de Autenticação (Login)
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    // Módulo de Admin (Clientes, Pets, etc.)
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [adminAuthGuard]
  },
  {
    // Módulo Cliente (Agendamentos)
    path: 'cliente',
    loadChildren: () => import('./features/cliente/cliente.module').then(m => m.ClienteModule),
    canActivate: [clienteAuthGuard]
  },
  {
    // Tela para cadastro de admin
    path: 'admin/cadastrar-admin',
    component: CadastrarAdminComponent,
    canActivate: [adminAuthGuard], // ✅ ou AuthGuard, depende do nome real
    data: { roles: ['ADMIN'] }
  },
  {
    // Rota curinga
    path: '**',
    redirectTo: '/auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
