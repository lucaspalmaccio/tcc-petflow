import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveForms

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';

@NgModule({ // Certifique-se de que @NgModule está presente
declarations: [
LoginComponent
],
imports: [
CommonModule,
AuthRoutingModule,
ReactiveFormsModule // Adiciona o módulo para trabalharmos com formulários
]
})
export class AuthModule { } // Certifique-se de que a classe está sendo exportada
