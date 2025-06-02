
import { Component, OnInit } from '@angular/core';
import { CheckoutService } from '../../../../services/checkout.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Direccion } from '../../../../services/models/direccion'; 

@Component({
  selector: 'app-checkout-direccion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-direccion.component.html',
  styleUrls: ['./checkout-direccion.component.css']
})
export class CheckoutDireccionComponent implements OnInit {
  direcciones: Direccion[] = []; 
  direccionSeleccionada: number | null = null; 

  constructor(private checkoutService: CheckoutService) { }

  ngOnInit() {
    this.cargarDirecciones();
 
    this.checkoutService.direccionSeleccionada$.subscribe(id => {
      this.direccionSeleccionada = id;
    });
  }

  cargarDirecciones(): void {
    // agrego un array de objetos Direccion del servicio
    this.checkoutService.getDireccionesEnvio().subscribe((direcciones: Direccion[]) => {
      this.direcciones = direcciones;
      console.log('Direcciones cargadas:', this.direcciones);

      if (this.direccionSeleccionada === null && this.direcciones.length > 0) {
        
        // Llamamos a actualizarDireccion para guardar esta selección en el servicio
      }
    });
  }


  actualizarDireccion() {

    this.checkoutService.setDireccionSeleccionada(this.direccionSeleccionada);
  }
}