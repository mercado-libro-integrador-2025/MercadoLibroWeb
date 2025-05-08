import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginService } from '../services/login.service';  

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(private loginService: LoginService, private router: Router) { }

  canActivate(): boolean {
    const cliente = this.loginService.obtenerClienteLogueado();
    console.log('Cliente logueado en canActivate:', cliente);
    if (cliente && cliente.access) {
      console.log('Acceso permitido');
      return true;
    } else {
      console.warn('Acceso denegado. Redirigiendo a /inicio');
      this.router.navigate(['/inicio']);
      return false;
    }
  }
  
}
