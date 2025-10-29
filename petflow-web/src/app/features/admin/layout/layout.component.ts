import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Perfil } from '../../../core/services/auth.service';

@Component({
selector: 'app-layout',
templateUrl: './layout.component.html',
styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

userName: string | null = null;
perfil: Perfil | null = null;

constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Busca o nome e o perfil do usuário logado
    this.userName = this.authService.getUserName();
    this.perfil = this.authService.getUserRole();
  }

  logout(): void {
    this.authService.logout();
  }

  // Exemplo de navegação condicional pelo layout
  irParaHome(): void {
    if (!this.perfil) return;

    switch (this.perfil) {
      case Perfil.ADMIN:
        this.router.navigate(['/admin/clientes']);
        break;
      case Perfil.CLIENTE:
        this.router.navigate(['/cliente/meus-agendamentos']);
        break;
    }
  }
}
