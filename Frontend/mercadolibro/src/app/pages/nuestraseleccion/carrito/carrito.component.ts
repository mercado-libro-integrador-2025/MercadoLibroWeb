import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { CarritoService } from '../../../services/carrito.service';
import { Router } from '@angular/router';

interface CarritoItem {
  titulo: string;
  precio: number;
  cantidad: number;
}

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

  constructor(private carritoService: CarritoService,private router:Router) {

    this.carritoService.carrito.subscribe(carrito => {
      this.carrito = carrito;
      this.calcularTotal();
    });
  }

  agregarAlCarrito(item: CarritoItem): void {
    const existingItem = this.carrito.find(ci => ci.titulo === item.titulo);
    if (existingItem) {
      existingItem.cantidad++;
    } else {
      this.carrito.push({ ...item, cantidad: 1 });
    }
    this.actualizarCarrito();
  }

  eliminarDelCarrito(titulo: string): void {
    const index = this.carrito.findIndex(ci => ci.titulo === titulo);
    if (index > -1) {
      this.carrito[index].cantidad--;
      if (this.carrito[index].cantidad === 0) {
        this.carrito.splice(index, 1);
      }
      this.actualizarCarrito();
    }
  }

  calcularTotal(): void {
    this.total = this.carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  }

  private actualizarCarrito(): void {
    this.carritoService.actualizarCantidadProductos(this.carrito);
  }
  irADashboardresumen(): void {
    this.router.navigate(['/dashboard/resumenCompra']);
  }
}
