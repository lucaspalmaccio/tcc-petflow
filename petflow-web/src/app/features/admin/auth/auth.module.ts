import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveForms

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';

@NgModule({
declarations: [
LoginComponent
],
imports: [
CommonModule,
AuthRoutingModule,
ReactiveFormsModule // Adiciona o módulo para trabalharmos com formulários
]
})
export class AuthModule { }