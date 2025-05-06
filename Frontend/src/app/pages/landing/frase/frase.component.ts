import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-frase',
  standalone: true,
  template: `
    
    <div class="frase-container">
      <p class="frase">{{ frase }}</p>
    </div>
  `,
  styleUrls: ['./frase.component.scss']
})
export class FraseComponent implements OnInit {
  frases = [
    "\"Y te elegiría a ti; en cien vidas, en cien mundos, en cualquier versión de la realidad, te encontraría y te elegiría\". El caos de las estrellas, Kiersten White.",
    "\"¿Qué si te amo? Dios mío, si tu amor fuera un grano de arena, el mío sería un universo de playas\" - La princesa prometida, William Goldman",
    "\"Me atraviesas el alma. Soy mitad agonía, mitad esperanza… no he amado a nadie más que a ti\" - Persuasión, Jane Austen",
    "\"Y por un instante, nos miramos directamente a los ojos y vimos algunas de las cosas verdaderas que nos hacían ser amigos\". El cuerpo, Stephen King.",
    "\"No amo a medias, no está en mi naturaleza\" - La abadía de Northanger, Jane Austen",
    "\"Y sentí que me hundía en las delicias de las arenas movedizas de su ternura\" - Crónica de una muerte anunciada, Gabriel García Márquez.",
    "\"Cuando se ama a una persona se la ama tal como es, aunque no sea como uno quisiera que fuese\" - Anna Karenina, Leon Tolstoy",
    "\"Mientras el corazón late, mientras el cuerpo y alma siguen juntos, no puedo admitir que cualquier criatura dotada de voluntad tiene necesidad de perder la esperanza en la vida\" - Viaje al centro de la tierra, Julio Verne",
    "\"Tengo esperanza o podría no vivir\" - La isla del doctor Moreau, H.G. Wells",
    "\"Llamo a la gente “rica” cuando son capaces de satisfacer las necesidades de su imaginación\" - El retrato de una dama, Henry James",
    "\"Luchar hasta el último aliento\" - Enrique VI, William Shakespeare",
  ];
  fraseActualIndex = 0;

  constructor() { }

  ngOnInit(): void {
    this.mostrarSiguienteFrase();
    setInterval(() => {
      this.mostrarSiguienteFrase();
    }, 10000);
  }

  mostrarSiguienteFrase(): void {
    if (this.fraseActualIndex < this.frases.length) {
      this.fraseActualIndex++;
    } else {
      this.fraseActualIndex = 0;
    }
  }

  get frase(): string {
    return this.frases[this.fraseActualIndex];
  }
}