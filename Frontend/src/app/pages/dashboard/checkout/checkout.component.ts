import { Component } from '@angular/core';
import { CheckoutResumenComponent } from './checkout-resumen/checkout-resumen.component';
import { CheckoutDireccionComponent } from './checkout-direccion/checkout-direccion.component';
import { CheckoutBotonComponent } from './checkout-boton/checkout-boton.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CheckoutResumenComponent, 
    CheckoutDireccionComponent, 
    CheckoutBotonComponent,
    CommonModule
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent{

}