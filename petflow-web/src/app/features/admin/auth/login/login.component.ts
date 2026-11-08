import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, Perfil, LoginResponse } from '../../../../core/services/auth.service';

@Component({
selector: 'app-login',
templateUrl: './login.component.html',
styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

loginForm: FormGroup;
errorMessage: string = '';
isLoading = false;
showPassword = false;

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
        const perfil = this.authService.getUserRole();
        if (this.authService.isAuthenticated() && perfil) {
            this.redirectUser(perfil);
        }
    }

    /** Campo inválido já tocado (ou formulário enviado): mostra erro e aria-invalid. */
    hasError(campo: string): boolean {
        const control = this.loginForm.get(campo);
        return !!control && control.touched && control.invalid;
    }

    onSubmit(): void {
        this.loginForm.markAllAsTouched();
        if (this.loginForm.invalid) {
            this.errorMessage = "Por favor, preencha o e-mail e a senha.";
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        const credentials = {
            email: this.loginForm.value.email,
            senha: this.loginForm.value.senha
        };

        console.log('📤 LoginComponent enviando:', credentials);

        this.authService.login(credentials).subscribe({
            next: (response: LoginResponse) => {
                console.log('✅ Response completa:', response);
                console.log('✅ UserRole:', response.userRole);

                this.isLoading = false;
                if (response.userRole) {
                    console.log('✅ Vai redirecionar para:', response.userRole);
                    this.redirectUser(response.userRole);
                } else {
                    this.errorMessage = "E-mail ou senha inválidos.";
                }
            },
            error: (err: any) => {
                console.error('❌ Erro no login:', err);
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

    private redirectUser(perfil: Perfil): void {
        console.log('🔀 redirectUser chamado com:', perfil);

        switch (perfil) {
            case Perfil.ADMIN:
                console.log('→ Redirecionando para admin');
                this.router.navigate(['/admin/clientes']);
                break;
            case Perfil.CLIENTE:
                console.log('→ Redirecionando para cliente');
                this.router.navigate(['/cliente/meus-agendamentos']);
                break;
            default:
                console.log('❌ Perfil não reconhecido!');
                this.errorMessage = "Perfil de usuário não reconhecido.";
                this.authService.logout();
                break;
        }
    }
}