import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // ✅ Importa os dois
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

// ✅ Importa o novo componente de cadastro de admin
import { CadastrarAdminComponent } from './pages/cadastrar-admin/cadastrar-admin.component';

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
// ✅ Novo
CadastrarAdminComponent
],
imports: [
CommonModule,
RouterModule,
AdminRoutingModule,
HttpClientModule,
FormsModule,
ReactiveFormsModule, // ✅ Fundamental para [formGroup]
CalendarModule
]
})
export class AdminModule { }
