import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from '../../core/guards/auth.guard';

// Componentes Admin
import { ClienteListComponent } from './pages/clientes/cliente-list/cliente-list.component';
import { ClienteFormComponent } from './pages/clientes/cliente-form/cliente-form.component';
import { ServicoListComponent } from './pages/servicos/servico-list/servico-list.component';
import { ServicoFormComponent } from './pages/servicos/servico-form/servico-form.component';
import { ProdutoListComponent } from './pages/produtos/produto-list/produto-list.component';
import { ProdutoFormComponent } from './pages/produtos/produto-form/produto-form.component';
import { AgendaComponent } from './pages/agenda/agenda.component';
import { CadastrarAdminComponent } from './pages/cadastrar-admin/cadastrar-admin.component';

// === INÍCIO SPRINT 04 (UC08) ===
import { DashboardComponent } from './pages/dashboard/dashboard.component';
// === FIM SPRINT 04 ===

const routes: Routes = [
{
path: '',
component: LayoutComponent,
children: [
// === INÍCIO SPRINT 04 (UC08) ===
// Dashboard
{
path: 'dashboard',
title: 'Resumo financeiro',
component: DashboardComponent,
canActivate: [authGuard], // Protegendo a rota
data: { roles: ['ADMIN'] }  // Apenas Admin pode ver
},
// === FIM SPRINT 04 ===

// Agenda
{ path: 'agenda', title: 'Agenda', component: AgendaComponent },

// Clientes
{ path: 'clientes', title: 'Clientes', component: ClienteListComponent },
{ path: 'clientes/novo', title: 'Cadastrar cliente', component: ClienteFormComponent },
{ path: 'clientes/editar/:id', title: 'Editar cliente', component: ClienteFormComponent },

// Serviços
{ path: 'servicos', title: 'Serviços', component: ServicoListComponent },
{ path: 'servicos/novo', title: 'Novo serviço', component: ServicoFormComponent },
{ path: 'servicos/editar/:id', title: 'Editar serviço', component: ServicoFormComponent },

// Produtos
{ path: 'produtos', title: 'Produtos', component: ProdutoListComponent },
{ path: 'produtos/novo', title: 'Novo produto', component: ProdutoFormComponent },
{ path: 'produtos/editar/:id', title: 'Editar produto', component: ProdutoFormComponent },

// Cadastro de Admin (somente ADMIN)
{
path: 'cadastrar',
title: 'Cadastrar administrador',
component: CadastrarAdminComponent,
canActivate: [authGuard],
data: { roles: ['ADMIN'] }
},

// { path: '', redirectTo: 'agenda', pathMatch: 'full' } // Descomente se 'dashboard' não for o padrão
{ path: '', redirectTo: 'dashboard', pathMatch: 'full' } // Alterei para o dashboard ser o novo padrão
]
}
];

@NgModule({
imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}