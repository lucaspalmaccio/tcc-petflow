import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ClienteFormComponent } from './features/admin/pages/clientes/cliente-form/cliente-form.component';

const routes: Routes = [
{ path: '', redirectTo: '/auth/login', pathMatch: 'full' },

{
path: 'auth',
loadChildren: () => import('./features/admin/auth/auth.module').then(m => m.AuthModule)
  },

  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }
  },

  // Rota pública de cadastro do cliente
  { path: 'cliente/cadastro', component: ClienteFormComponent },

  // Módulo cliente protegido (demais rotas)
  {
    path: 'cliente',
    loadChildren: () => import('./features/cliente/cliente.module').then(m => m.ClienteModule),
    canActivate: [authGuard],
    data: { roles: ['CLIENTE'] }
  },

  { path: '**', redirectTo: '/auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
