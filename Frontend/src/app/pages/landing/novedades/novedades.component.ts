import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-novedades',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './novedades.component.html',
  styleUrl: './novedades.component.css'
})
export class NovedadesComponent {
  novedades = [
    {
      id: 1,
      titulo: "POR SI UN DÍA VOLVEMOS",
      autor: "María Dueñas",
      formato: "Físico",
      precio: 15000,
      portada: "https://i.imgur.com/FCViY5D.jpeg",
      descripcion: `En esta ciudad africana de origen árabe, pulso español y administración francesa desembarca una joven con el falso nombre de Cecilia Belmonte. En apariencia, ha cruzado el Mediterráneo para escapar de la miseria, como tantos compatriotas. Su razón, sin embargo, es más turbia.
La urgencia por sobrevivir la obliga a dejarse la piel en plantaciones y lavaderos, como empleada doméstica y operaria de fábrica a destajo. Hasta que una madrugada, en la tabaquera Bastos, participa en un delito por el que paga con su sometimiento a un hombre despreciable. Su entereza será lo que la libere y le aporte el coraje para rehacerse y emprender un camino en ascenso, repleto de quiebros, logros y desafíos a lo largo de tres décadas vibrantes.
Esta es la historia de una mujer que vivió el auge colonial y el trágico fin de la Argelia francesa. Y, en paralelo, sus páginas rescatan la memoria de los desconocidos pieds-noirs españoles que, arrastrados por la emigración y el exilio, formaron parte de aquel mundo.
Vuelve María Dueñas, autora de la inolvidable El tiempo entre costuras, con una nueva novela que te cautivará.`
    },
    {
      id: 2,
      titulo: "EL LOCO DE DIOS EN EL FIN DEL MUNDO",
      autor: "Javier Cercas",
      formato: "Físico",
      precio: 22000,
      portada: "https://i.imgur.com/i4k4AqQ.jpeg",
      descripcion:  `Una apasionante crónica que combina historia, periodismo y literatura para narrar la vida de un cura revolucionario en los confines del mundo. Javier Cercas explora el conflicto entre fe y justicia en un entorno extremo. Ideal para lectores de no ficción narrativa con tintes políticos.`
    },
    {
      id: 3,
      titulo: "LA ASISTENTA",
      autor: "Freida McFadden",
      formato: "Físico",
      precio: 22500,
      portada: "https://i.imgur.com/oWiLtQc.jpeg",
      descripcion: `Un thriller psicológico absolutamente adictivo...`
    },
    {
      "id": 4,
      "titulo": "EL PUENTE DONDE HABITAN LAS MARIPOSAS",
      "autor": "Nazareth Castellanos",
      "formato": "Físico",
      "precio": 18000,
      "portada": "https://i.imgur.com/ufGmclO.jpeg",
      "descripcion":`Un thriller psicológico absolutamente adictivo...`
    },
    {
      "id": 5,
      "titulo": "EL TREN DE LOS LOCOS",
      "autor": "Patxi Irurzun",
      "formato": "Físico",
      "precio": 20000,
      "portada": "https://i.imgur.com/jShbuNu.jpeg",
      "descripcion": `Un thriller psicológico absolutamente adictivo...`
    },
    {
      "id": 6,
      "titulo": "EL MANZANO",
      "autor": "CHRISTIAN BERKEL",
      "formato": "Físico",
      "precio": 5000,
      "portada": "https://i.imgur.com/RALxInX.jpeg",
      "descripcion": `Un thriller psicológico absolutamente adictivo...`
    },
    {
      "id": 7,
      "titulo": "LAS CENIZAS Y EL REY MALDITO",
      "autor": "Carissa Broadbent",
      "formato": "Físico",
      "precio": 5000,
      "portada": "https://i.imgur.com/rDdslPP.jpeg",
      "descripcion": `Un thriller psicológico absolutamente adictivo...`
    },
    {
      id: 8,
      titulo: "EL ESPÍA",
      autor: "Jorge Díaz",
      formato: "Físico",
      precio: 21000,
      portada: "https://i.imgur.com/FHVlQIH.jpeg",
      descripcion: `Un thriller psicológico absolutamente adictivo...`
    }
  ];
}
