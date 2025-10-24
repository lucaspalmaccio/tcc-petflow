import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

// Componentes Sprint 01
import { ClienteListComponent } from './pages/clientes/cliente-list/cliente-list.component';
import { ClienteFormComponent } from './pages/clientes/cliente-form/cliente-form.component';
// Componentes Sprint 02
import { ServicoListComponent } from './pages/servicos/servico-list/servico-list.component';
import { ServicoFormComponent } from './pages/servicos/servico-form/servico-form.component';
import { ProdutoListComponent } from './pages/produtos/produto-list/produto-list.component';
import { ProdutoFormComponent } from './pages/produtos/produto-form/produto-form.component';
// Componentes Sprint 03
import { AgendaComponent } from './pages/agenda/agenda.component';


const routes: Routes = [
{
path: '',
component: LayoutComponent,
children: [
// Rotas Sprint 03 (UC05 - Admin)
{ path: 'agenda', component: AgendaComponent },

// Rotas Sprint 01 (UC02/UC03)
{ path: 'clientes', component: ClienteListComponent },
{ path: 'clientes/novo', component: ClienteFormComponent },
{ path: 'clientes/editar/:id', component: ClienteFormComponent },

// Rotas Sprint 02 (UC04)
{ path: 'servicos', component: ServicoListComponent },
{ path: 'servicos/novo', component: ServicoFormComponent },
{ path: 'servicos/editar/:id', component: ServicoFormComponent },
{ path: 'produtos', component: ProdutoListComponent },
{ path: 'produtos/novo', component: ProdutoFormComponent },
{ path: 'produtos/editar/:id', component: ProdutoFormComponent },

// (Rotas da Sprint 4...)

{ path: '', redirectTo: 'agenda', pathMatch: 'full' } // Admin agora começa na Agenda
]
}
];

@NgModule({
imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
