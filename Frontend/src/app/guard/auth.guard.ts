import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(private loginService: LoginService, private router: Router) { }

  canActivate(): boolean {
    const cliente = this.loginService.obtenerClienteLogueado();
    console.log('Cliente logueado en canActivate:', cliente);

    // Verificamos si el cliente tiene token y si el token no ha expirado
    if (cliente && cliente.access && !this.loginService.isAccessTokenExpired()) {
      console.log('Acceso permitido');
      return true;
    } else {
      console.warn('Acceso denegado. Redirigiendo a /inicio');
      // Redirigir al usuario si el token no está presente o ha expirado
      this.router.navigate(['/inicio']);
      return false;
    }
  }
}
