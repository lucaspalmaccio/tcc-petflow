import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
selector: 'app-layout',
templateUrl: './layout.component.html',
styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
userName: string | null = null;

constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Busca o nome do usuário salvo no localStorage
    this.userName = this.authService.getUserName();
  }

  /**
   * Executa o logout ao clicar no botão "Sair".
   */
  logout(): void {
    this.authService.logout();
  }
}