import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
selector: 'app-cliente-layout',
templateUrl: './cliente-layout.component.html',
styleUrls: ['./cliente-layout.component.css']
})
export class ClienteLayoutComponent implements OnInit {
userName: string | null = null;

constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userName = this.authService.getUserName();
  }

  logout(): void {
    this.authService.logout();
  }
}
