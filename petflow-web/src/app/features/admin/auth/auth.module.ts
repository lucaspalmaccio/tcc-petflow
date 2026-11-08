import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveForms

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { FocusInvalidDirective } from '../../../shared/a11y/focus-invalid.directive';

@NgModule({
declarations: [
LoginComponent
],
imports: [
CommonModule,
AuthRoutingModule,
ReactiveFormsModule, // Adiciona o módulo para trabalharmos com formulários
FocusInvalidDirective
]
})
export class AuthModule { }