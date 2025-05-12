import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

horariosSemana: string;
horarioSabado: string;

constructor(){
  this.horariosSemana = 'Lunes a viernes: De 10:00 hs a 19:00 hs';
  this.horarioSabado = 'Sabados: De 10:00 hs a 14:00 hs';
}

}


