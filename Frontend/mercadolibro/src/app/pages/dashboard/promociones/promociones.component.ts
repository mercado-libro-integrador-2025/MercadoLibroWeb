import { Component } from '@angular/core';
import { PromocionesService } from '../../../services/promociones.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-promociones',
  standalone: true,
  imports: [NgFor],
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css']
})
export class PromocionesComponent {
  promociones: any[];

  constructor(private promocionesService: PromocionesService) {
    this.promociones = this.promocionesService.getPromociones();
  }

  copyDiscountCode(discountCode: string) {
    navigator.clipboard.writeText(discountCode).then(() => {
      alert(`Código ${discountCode} copiado al portapapeles.`);
    }, () => {
      alert(`No se pudo copiar el código ${discountCode}.`);
    });
  }
}
