import { Component } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  cantidadProductosCarrito: number = 0;

  constructor(private carritoService: CarritoService) {
    this.carritoService.cantidadProductos.subscribe(cantidad => {
      this.cantidadProductosCarrito = cantidad;
    });
  }
}
