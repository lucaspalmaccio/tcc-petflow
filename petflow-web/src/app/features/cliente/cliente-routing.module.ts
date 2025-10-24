import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteLayoutComponent } from './layout/cliente-layout.component';
import { MeusAgendamentosComponent } from './pages/meus-agendamentos/meus-agendamentos.component';

const routes: Routes = [
{
path: '',
component: ClienteLayoutComponent, // Layout "casca" do cliente
children: [
{
path: 'agendamentos',
component: MeusAgendamentosComponent // Página principal do cliente
},
{
path: '',
redirectTo: 'agendamentos', // Redireciona /cliente para /cliente/agendamentos
pathMatch: 'full'
}
]
}
];

@NgModule({
imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule { }
