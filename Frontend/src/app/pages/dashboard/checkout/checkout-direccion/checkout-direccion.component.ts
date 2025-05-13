import { Component, OnInit } from '@angular/core';
import { CheckoutService } from '../../../../services/checkout.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout-direccion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-direccion.component.html',
  styleUrls: ['./checkout-direccion.component.css']
})
export class CheckoutDireccionComponent implements OnInit {
  direcciones: string[] = [];
  direccionSeleccionada: string = '';

  constructor(private checkoutService: CheckoutService) {}

  ngOnInit() {
    this.cargarDirecciones();
    this.direccionSeleccionada = this.checkoutService.getDireccionSeleccionada();
  }

  cargarDirecciones(): void {
    this.checkoutService.getDireccionesEnvio().subscribe((direcciones: string[]) => {
      this.direcciones = direcciones;
    });
  }

  actualizarDireccion() {
    this.checkoutService.setDireccionSeleccionada(this.direccionSeleccionada);
  }
}
