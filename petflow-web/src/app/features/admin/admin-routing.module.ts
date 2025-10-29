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

const routes: Routes = [
{
path: '',
component: LayoutComponent,
children: [
// Agenda
{ path: 'agenda', component: AgendaComponent },

// Clientes
{ path: 'clientes', component: ClienteListComponent },
{ path: 'clientes/novo', component: ClienteFormComponent },
{ path: 'clientes/editar/:id', component: ClienteFormComponent },

// Serviços
{ path: 'servicos', component: ServicoListComponent },
{ path: 'servicos/novo', component: ServicoFormComponent },
{ path: 'servicos/editar/:id', component: ServicoFormComponent },

// Produtos
{ path: 'produtos', component: ProdutoListComponent },
{ path: 'produtos/novo', component: ProdutoFormComponent },
{ path: 'produtos/editar/:id', component: ProdutoFormComponent },

// Cadastro de Admin (somente ADMIN)
{
path: 'cadastrar',
component: CadastrarAdminComponent,
canActivate: [authGuard],
data: { roles: ['ADMIN'] }
},

{ path: '', redirectTo: 'agenda', pathMatch: 'full' }
]
}
];

@NgModule({
imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
