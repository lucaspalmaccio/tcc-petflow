import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { Perfil } from '../../core/services/auth.service';
import { MeusAgendamentosComponent } from './pages/meus-agendamentos/meus-agendamentos.component';
import { ClientePerfilComponent } from './pages/cliente-perfil/cliente-perfil.component';

const routes: Routes = [
{
path: '',
children: [
{
path: 'meus-agendamentos',
component: MeusAgendamentosComponent,
canActivate: [authGuard],
data: { roles: [Perfil.CLIENTE] }
},
{
path: 'perfil',
component: ClientePerfilComponent,
canActivate: [authGuard],
data: { roles: [Perfil.CLIENTE] }
},
{ path: '', redirectTo: 'meus-agendamentos', pathMatch: 'full' }
]
}
];

@NgModule({
imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClienteRoutingModule { }
