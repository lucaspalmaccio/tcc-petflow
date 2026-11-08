import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ClienteRoutingModule } from './cliente-routing.module';
import { ClienteLayoutComponent } from './layout/cliente-layout.component';
import { MeusAgendamentosComponent } from './pages/meus-agendamentos/meus-agendamentos.component';
import { AgendamentoModalComponent } from './components/agendamento-modal/agendamento-modal.component';
import { ClientePerfilComponent } from './pages/cliente-perfil/cliente-perfil.component';

// Importa AdminModule para usar ClienteFormComponent
import { AdminModule } from '../admin/admin.module';
import { ModalA11yDirective } from '../../shared/a11y/modal-a11y.directive';
import { FocusInvalidDirective } from '../../shared/a11y/focus-invalid.directive';
import { SkipLinkDirective } from '../../shared/a11y/skip-link.directive';
import { FormA11yDirective } from '../../shared/a11y/form-a11y.directive';
import { MainLandmarkDirective } from '../../shared/a11y/main-landmark.directive';

@NgModule({
declarations: [
ClienteLayoutComponent,
MeusAgendamentosComponent,
AgendamentoModalComponent,
ClientePerfilComponent
],
imports: [
CommonModule,
FormsModule,
ReactiveFormsModule,
RouterModule,
ClienteRoutingModule,
AdminModule,
ModalA11yDirective,
FocusInvalidDirective,
FormA11yDirective,
MainLandmarkDirective,
SkipLinkDirective
]
})
export class ClienteModule { }
