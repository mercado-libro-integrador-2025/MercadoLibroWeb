import { Component, OnInit } from '@angular/core';
import { CarritoItem, CheckoutService } from '../../../../services/checkout.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout-resumen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-resumen.component.html',
  styleUrls: ['./checkout-resumen.component.css']
})
export class CheckoutResumenComponent implements OnInit {
  carrito: CarritoItem[] = [];
  total: number = 0;

  constructor(private checkoutService: CheckoutService) {}

  ngOnInit() {
    this.carrito = this.checkoutService.obtenerCarrito();
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  }
}
