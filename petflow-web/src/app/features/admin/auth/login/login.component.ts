import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, Perfil } from '../../../../core/services/auth.service';

@Component({
selector: 'app-login',
templateUrl: './login.component.html',
styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

loginForm: FormGroup;
errorMessage: string | null = null;
isLoading = false;
showPassword = false;

constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            senha_normal: ['', [Validators.required]]
        });
    }

    ngOnInit(): void {
        const perfil = this.authService.getUserRole();
        if (this.authService.isAuthenticated() && perfil) {
            this.redirectUser(perfil);
        }
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.errorMessage = "Por favor, preencha o e-mail e a senha.";
            return;
        }

        this.isLoading = true;
        this.errorMessage = null;

        const { email, senha_normal } = this.loginForm.value;

        this.authService.login(email, senha_normal).subscribe({
            next: (response) => {
                console.log('1. Response completa:', response);
                console.log('2. UserRole:', response.userRole);
                console.log('3. Tipo do userRole:', typeof response.userRole);

                this.isLoading = false;
                if (response.userRole) {
                    console.log('4. Vai redirecionar para:', response.userRole);
                    this.redirectUser(response.userRole);
                } else {
                    this.errorMessage = "E-mail ou senha inválidos.";
                }
            },
            error: () => {
                this.isLoading = false;
                this.errorMessage = "E-mail ou senha inválidos.";
            }
        });
    }

    cadastrarCliente(): void {
        this.router.navigate(['/cliente/cadastro']);
    }

    togglePassword(): void {
        this.showPassword = !this.showPassword;
    }

    private redirectUser(perfil: Perfil | null): void {
        console.log('5. redirectUser chamado com:', perfil);

        if (!perfil) {
            this.errorMessage = "Perfil de usuário não reconhecido.";
            this.authService.logout();
            return;
        }

        console.log('6. Perfil.CLIENTE =', Perfil.CLIENTE);
        console.log('7. perfil === Perfil.CLIENTE?', perfil === Perfil.CLIENTE);

        switch (perfil) {
            case Perfil.ADMIN:
                console.log('8. Redirecionando para admin');
                this.router.navigate(['/admin/clientes']);
                break;
            case Perfil.CLIENTE:
                console.log('9. Redirecionando para cliente');
                this.router.navigate(['/cliente/meus-agendamentos']);  // ← CORRIGIDO AQUI
                break;
            default:
                console.log('10. Caiu no default!');
                this.errorMessage = "Perfil de usuário não reconhecido.";
                this.authService.logout();
                break;
        }
    }
}