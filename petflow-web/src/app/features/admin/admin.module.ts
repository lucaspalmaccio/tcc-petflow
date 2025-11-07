import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutComponent } from './layout/layout.component';

// Componentes Sprint 01
import { ClienteListComponent } from './pages/clientes/cliente-list/cliente-list.component';
import { ClienteFormComponent } from './pages/clientes/cliente-form/cliente-form.component';
import { PetFormModalComponent } from './components/pet-form-modal/pet-form-modal.component';

// Componentes Sprint 02
import { ServicoListComponent } from './pages/servicos/servico-list/servico-list.component';
import { ServicoFormComponent } from './pages/servicos/servico-form/servico-form.component';
import { ProdutoListComponent } from './pages/produtos/produto-list/produto-list.component';
import { ProdutoFormComponent } from './pages/produtos/produto-form/produto-form.component';

// Sprint 03
import { AgendaComponent } from './pages/agenda/agenda.component';
import { CalendarModule } from 'angular-calendar';
import { CadastrarAdminComponent } from './pages/cadastrar-admin/cadastrar-admin.component';

// === INÍCIO SPRINT 04 (UC08 - CORREÇÃO) ===
import { DashboardComponent } from './pages/dashboard/dashboard.component';
// === FIM SPRINT 04 ===

@NgModule({
declarations: [
LayoutComponent,
// Sprint 01
ClienteListComponent,
ClienteFormComponent,
PetFormModalComponent,
// Sprint 02
ServicoListComponent,
ServicoFormComponent,
ProdutoListComponent,
ProdutoFormComponent,
// Sprint 03
AgendaComponent,
CadastrarAdminComponent,

// === INÍCIO SPRINT 04 (UC08 - CORREÇÃO) ===
DashboardComponent // <-- Adicione o componente aqui
// === FIM SPRINT 04 ===
],
imports: [
CommonModule,
RouterModule,
AdminRoutingModule,
HttpClientModule,
FormsModule,
ReactiveFormsModule,
CalendarModule
]
})
export class AdminModule { }