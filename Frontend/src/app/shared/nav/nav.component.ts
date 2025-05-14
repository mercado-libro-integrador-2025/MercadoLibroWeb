import { CheckoutService } from '../../services/checkout.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLinkActive, RouterLink,CommonModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  cantidadProductosCarrito: number = 0;
  isAuthenticated$: Observable<boolean>; // Observable para saber si está autenticado
  mostrarCarrito = false;

  constructor(
    private checkoutService: CheckoutService,
    private loginService: LoginService,
    private router: Router
  ) {
    this.isAuthenticated$ = this.loginService.isAuthenticated(); // Conectar con el servicio de autenticación
  }

  ngOnInit() {
    this.checkoutService.cantidadProductos.subscribe(cantidad => {
      this.cantidadProductosCarrito = cantidad;
    });
  }

  toggleCarrito() {
    this.mostrarCarrito = !this.mostrarCarrito;
  }

  logout() {
    this.loginService.logout(); // Llamar al servicio de logout
    this.router.navigate(['/inicio']); // Redirigir al login después de cerrar sesión
  }
}
