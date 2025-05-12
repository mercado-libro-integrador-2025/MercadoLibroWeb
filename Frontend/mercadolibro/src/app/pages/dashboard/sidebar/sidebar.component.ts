import { Component } from '@angular/core';
import { DatospersonalesComponent } from '../datospersonales/datospersonales.component';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(private loginService: LoginService, private router: Router) { }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']); // Redirige a la página de inicio de sesión al cerrar sesión
  }
}

