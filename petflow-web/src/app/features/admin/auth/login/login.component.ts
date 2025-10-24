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
    // Inicializa o formulário reativo
    this.loginForm = this.fb.group({
      // UC01 [117]: "O usuário informa seu e-mail e senha"
      // Validação baseada no Fluxo de Exceção [122]: "Campos Vazios"
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Se o usuário já estiver logado (ex: acessou /login manualmente)
    // o redireciona para a rota correta.
    if (this.authService.isAuthenticated()) {
      this.redirectUser(this.authService.getUserRole());
    }
  }

  /**
   * Chamado quando o formulário é enviado.
   * UC01 [118]: "O usuário aciona a opção 'Entrar'."
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = "Por favor, preencha o e-mail e a senha.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const { email, senha } = this.loginForm.value;

    // Chama o serviço de autenticação
    this.authService.login(email, senha).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response) {
          // Pós-condição UC01 [115]: Redireciona com base no perfil
          this.redirectUser(response.userRole);
        } else {
          // UC01 Fluxo de Exceção [123]: "Credenciais Inválidas"
          this.errorMessage = "E-mail ou senha inválidos.";
        }
      },
      error: (err) => {
        // Erro de rede ou servidor fora do ar
        this.isLoading = false;
        this.errorMessage = "Erro ao tentar conectar. Tente novamente.";
      }
    });
  }

  /**
   * (Função atualizada na Sprint 03)
   * Redireciona o usuário com base no seu perfil.
   */
  private redirectUser(role: string | null): void {
    if (role === 'ROLE_ADMIN') {
      this.router.navigate(['/admin']);
    } else if (role === 'ROLE_CLIENTE') {
      this.router.navigate(['/cliente']);
    } else {
      // Se não tiver perfil (ou for nulo), desloga por segurança
      this.errorMessage = "Perfil de usuário não reconhecido.";
      this.authService.logout();
    }
  }
}