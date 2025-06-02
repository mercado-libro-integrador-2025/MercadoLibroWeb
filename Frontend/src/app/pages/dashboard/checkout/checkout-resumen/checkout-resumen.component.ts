import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { CarritoItem, CheckoutService } from '../../../../services/checkout.service';
import { CommonModule, DecimalPipe } from '@angular/common'; 
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout-resumen',
  standalone: true,
  imports: [CommonModule, DecimalPipe], 
  templateUrl: './checkout-resumen.component.html',
  styleUrls: ['./checkout-resumen.component.css']
})
export class CheckoutResumenComponent implements OnInit, OnDestroy { 
  carrito: CarritoItem[] = [];
  total: number = 0;
  private carritoSubscription: Subscription | undefined; 

  constructor(private checkoutService: CheckoutService) {}

  ngOnInit() {
    this.carritoSubscription = this.checkoutService.carrito.subscribe(carritoActualizado => {
      this.carrito = carritoActualizado;
      this.calcularTotal(); 
    });
  }

  ngOnDestroy() {
    if (this.carritoSubscription) {
      this.carritoSubscription.unsubscribe();
    }
  }

  calcularTotal() {
    this.total = this.carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  }
}