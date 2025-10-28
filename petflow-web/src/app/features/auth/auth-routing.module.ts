import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
{
path: 'login', // Rota para /auth/login
component: LoginComponent
},
{
path: '',
redirectTo: 'login', // Se acessar apenas /auth, redireciona para login
pathMatch: 'full'
}
];

@NgModule({
imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
