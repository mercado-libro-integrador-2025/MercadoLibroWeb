import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { CheckoutService, CarritoItem } from '../../../services/checkout.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [NgFor],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss'],
})
export class CarritoComponent {
  carrito: CarritoItem[] = [];
  total: number = 0;

  constructor(private checkoutService: CheckoutService, private router:Router) {
    this.checkoutService.carrito.subscribe(carritoActualizado => {
      this.carrito = carritoActualizado;
      this.calcularTotal(); 
    });
  }

  agregarAlCarrito(item: CarritoItem): void {
    this.checkoutService.aumentarCantidad(item.titulo);
  }

  eliminarDelCarrito(titulo: string): void {
    this.checkoutService.disminuirCantidad(titulo);
  }

  calcularTotal(): void {
    this.total = this.carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  }

  irADashboardresumen(): void {
    this.router.navigate(['/dashboard/checkout']);
  }
}