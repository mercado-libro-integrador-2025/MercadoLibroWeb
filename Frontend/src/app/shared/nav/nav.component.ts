import { CarritoService } from '../../services/carrito.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

      cantidadProductosCarrito: number = 0;

  constructor(
    private carritoService: CarritoService,
    //private autenticacion : AutenticacionService
    private router: Router
  ) {
  }

      loggedIn: boolean = false;

    ngOnInit() {
    this.carritoService.cantidadProductos.subscribe(cantidad => {
      this.cantidadProductosCarrito = cantidad;
    });
    /*
    this.autenticacion.getLoggedIn().subscribe(loggedIn => {
      this.loggedIn = loggedIn; // Actualiza el estado de inicio de sesión en el componente
    });
    */
  }

  /*
  logout() {
    this.loggedIn = false;
    this.autenticacion.setLoggedIn(false);
    this.router.navigate(['/inicio']);
    this.autenticacion.logout();
    console.log(this.loggedIn);
  }
  */

    mostrarCarrito = false;

  toggleCarrito() {
    this.mostrarCarrito = !this.mostrarCarrito;
  }


}


