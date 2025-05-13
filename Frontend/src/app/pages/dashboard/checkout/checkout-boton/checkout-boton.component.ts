import { Component } from '@angular/core';
import { CheckoutService } from '../../../../services/checkout.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout-boton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-boton.component.html',
  styleUrl: './checkout-boton.component.css'
})

export class CheckoutBotonComponent {
  constructor(private checkoutService: CheckoutService) {}

  confirmarCompra() {
    this.checkoutService.confirmarCompra();
  }
}
