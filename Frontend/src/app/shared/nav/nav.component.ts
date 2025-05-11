import { CarritoService } from '../../services/carrito.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  cantidadProductosCarrito: number = 0;
  isAuthenticated$: Observable<boolean>; // Observable para saber si está autenticado
  mostrarCarrito = false;

  constructor(
    private carritoService: CarritoService,
    private loginService: LoginService,
    private router: Router
  ) {
    this.isAuthenticated$ = this.loginService.isAuthenticated(); // Conectar con el servicio de autenticación
  }

  ngOnInit() {
    this.carritoService.cantidadProductos.subscribe(cantidad => {
      this.cantidadProductosCarrito = cantidad;
    });
  }

  toggleCarrito() {
    this.mostrarCarrito = !this.mostrarCarrito;
  }

  logout() {
    this.loginService.logout(); // Llamar al servicio de logout
    this.router.navigate(['/login']); // Redirigir al login después de cerrar sesión
  }
}
