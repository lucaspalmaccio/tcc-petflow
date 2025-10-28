import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
selector: 'app-cadastrar-admin',
templateUrl: './cadastrar-admin.component.html',
styleUrls: ['./cadastrar-admin.component.css']
})
export class CadastrarAdminComponent {
form: FormGroup;
sucesso = false;
erro: string | null = null;
carregando = false;

constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  cadastrar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.carregando = true;
    this.erro = null;

    const novoAdmin = {
      nome: this.form.value.nome,
      email: this.form.value.email,
      senha: this.form.value.senha,
      perfil: 'ADMIN'
    };

    this.http.post(`${environment.apiUrl}/usuarios`, novoAdmin).subscribe({
      next: () => {
        this.sucesso = true;
        this.carregando = false;
        setTimeout(() => this.router.navigate(['/admin']), 1500);
      },
      error: (err) => {
        console.error(err);
        this.erro = err.error?.message || 'Erro ao cadastrar administrador.';
        this.carregando = false;
      }
    });
  }
}
