import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { ClienteRoutingModule } from './cliente-routing.module';
import { ClienteLayoutComponent } from './layout/cliente-layout.component';
import { MeusAgendamentosComponent } from './pages/meus-agendamentos/meus-agendamentos.component';
import { AgendamentoModalComponent } from './components/agendamento-modal/agendamento-modal.component';
import { ClientePerfilComponent } from './pages/cliente-perfil/cliente-perfil.component';  // ← ADICIONAR

@NgModule({
declarations: [
ClienteLayoutComponent,
MeusAgendamentosComponent,
AgendamentoModalComponent,
ClientePerfilComponent  // ← ADICIONAR
],
imports: [
CommonModule,
ClienteRoutingModule,
RouterModule,
ReactiveFormsModule
]
})
export class ClienteModule { }