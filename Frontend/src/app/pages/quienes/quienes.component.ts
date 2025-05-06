
import { Component } from '@angular/core';
import { QuienesService } from '../../services/quienes.service';


@Component({
  selector: 'app-quienes',
  standalone: true,
  imports: [],
  templateUrl: './quienes.component.html',
  styleUrl: './quienes.component.css'
})

export class QuienesComponent {
  constructor(private quienesService: QuienesService) {
    this.parrafo_quienes_somos = this.quienesService.getParrafoQuienesSomos();
    this.parrafo_nuestra_seleccion = this.quienesService.getParrafoNuestraSeleccion();
    this.parrafo_nuestra_pasion = this.quienesService.getParrafoNuestraPasion();
    this.parrafo_nuestro_compromiso = this.quienesService.getParrafoNuestroCompromiso();
  }

  parrafo_quienes_somos: string;
  parrafo_nuestra_seleccion: string;
  parrafo_nuestra_pasion: string;
  parrafo_nuestro_compromiso: string;
}

