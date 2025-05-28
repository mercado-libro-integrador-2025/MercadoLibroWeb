
import { NgForOf, NgStyle } from '@angular/common';
import { Component } from '@angular/core';


@Component({
  selector: 'app-quienes',
  standalone: true,
  imports: [],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css'
})

export class QuienesComponent {

  titulo = '¿Quiénes Somos?';
  subtitulo = 'Conectamos lectores y damos nueva vida a los libros físicos.';

  historiaTitulo = 'Nuestra historia';
  historiaTexto = `MercadoLibro nació como una iniciativa para recuperar el valor de los libros físicos olvidados o almacenados sin uso. Lo que comenzó como un proyecto de estudiantes se convirtió en una plataforma que impulsa el acceso a la lectura a través del intercambio responsable, fortaleciendo una economía circular del conocimiento.`;

  historia = `MercadoLibro nació como una iniciativa para recuperar el valor de los libros físicos olvidados o almacenados sin uso...`;
  valores = [
    {
      titulo: 'Revalorización del libro físico',
      texto: 'Creemos en el valor cultural y afectivo de los libros impresos, dándoles una segunda vida útil.'
    },
    {
      titulo: 'Acceso equitativo a la lectura',
      texto: 'Apostamos a facilitar el acceso al conocimiento sin depender del costo de los libros nuevos.'
    },
    {
      titulo: 'Comunidad colaborativa',
      texto: 'Construimos redes solidarias entre lectores que comparten, intercambian y se apoyan mutuamente.'
    }
  ];
}
