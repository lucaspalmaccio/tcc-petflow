import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
selector: 'app-login',
templateUrl: './login.component.html',
styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
loginForm: FormGroup;
errorMessage: string | null = null;
isLoading = false;

constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.redirectUser(this.authService.getUserRole());
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = "Por favor, preencha o e-mail e a senha.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const { email, senha } = this.loginForm.value;

    this.authService.login(email, senha).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response && response.userRole) {
          this.redirectUser(response.userRole);
        } else {
          this.errorMessage = "E-mail ou senha inválidos.";
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = "Erro ao tentar conectar. Tente novamente.";
      }
    });
  }

  cadastrarCliente(): void {
    // Navega para a tela de cadastro de cliente
    this.router.navigate(['/cliente/cadastro']);
  }

  private redirectUser(role: string | null): void {
    if (role === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else if (role === 'CLIENTE') {
      this.router.navigate(['/cliente']);
    } else {
      this.errorMessage = "Perfil de usuário não reconhecido.";
      this.authService.logout();
    }
  }
}
