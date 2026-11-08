import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutComponent } from './layout/layout.component';

// Componentes
import { ClienteListComponent } from './pages/clientes/cliente-list/cliente-list.component';
import { ClienteFormComponent } from './pages/clientes/cliente-form/cliente-form.component';
import { PetFormModalComponent } from './components/pet-form-modal/pet-form-modal.component';
import { ServicoListComponent } from './pages/servicos/servico-list/servico-list.component';
import { ServicoFormComponent } from './pages/servicos/servico-form/servico-form.component';
import { ProdutoListComponent } from './pages/produtos/produto-list/produto-list.component';
import { ProdutoFormComponent } from './pages/produtos/produto-form/produto-form.component';
import { AgendaComponent } from './pages/agenda/agenda.component';
import { CadastrarAdminComponent } from './pages/cadastrar-admin/cadastrar-admin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CalendarModule } from 'angular-calendar';
import { ModalA11yDirective } from '../../shared/a11y/modal-a11y.directive';
import { FocusInvalidDirective } from '../../shared/a11y/focus-invalid.directive';
import { SkipLinkDirective } from '../../shared/a11y/skip-link.directive';
import { FormA11yDirective } from '../../shared/a11y/form-a11y.directive';
import { MainLandmarkDirective } from '../../shared/a11y/main-landmark.directive';

@NgModule({
declarations: [
LayoutComponent,
ClienteListComponent,
ClienteFormComponent,
PetFormModalComponent,
ServicoListComponent,
ServicoFormComponent,
ProdutoListComponent,
ProdutoFormComponent,
AgendaComponent,
CadastrarAdminComponent,
DashboardComponent
],
imports: [
CommonModule,
RouterModule,
AdminRoutingModule,
HttpClientModule,
FormsModule,
ReactiveFormsModule,
CalendarModule,
ModalA11yDirective,
FocusInvalidDirective,
FormA11yDirective,
MainLandmarkDirective,
SkipLinkDirective
],
exports: [
ClienteFormComponent // ← exporta para o módulo cliente
]
})
export class AdminModule { }
