
import { CommonModule, NgFor, NgForOf, NgStyle } from '@angular/common';
import { Component } from '@angular/core';


@Component({
  selector: 'app-quienes',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css'
})

export class QuienesComponent {

  titulo = '¿Quiénes Somos?';
  subtitulo = 'Conectamos lectores y damos nueva vida a los libros físicos.';

  historiaTitulo = 'Nuestra historia';
  historiaTexto = `MercadoLibro nació como una iniciativa para recuperar el valor de los libros físicos olvidados o almacenados sin uso. Lo que comenzó como un proyecto de estudiantes se convirtió en una plataforma que impulsa el acceso a la lectura a través del intercambio responsable, fortaleciendo una economía circular del conocimiento.`;

  historia = `MercadoLibro nació como una iniciativa para recuperar el valor de los libros físicos olvidados o almacenados sin uso...`;
  
  misionTitulo = 'Nuestra Misión';
  misionTexto = 'Promover el acceso a la lectura mediante la revalorización e intercambio de libros físicos, facilitando una alternativa sostenible, colaborativa y económica que conecte a lectores de todas las edades y contextos.';
  visionTitulo = 'Nuestra Visión';
  visionTexto = 'Ser la plataforma líder en Latinoamérica para el intercambio responsable de libros físicos, fortaleciendo una comunidad lectora activa y generando impacto social, cultural y ambiental positivo a través de una economía circular del conocimiento.';
  
  valores = [
    {
      titulo: 'Revalorización del libro físico',
      descripcion: 'Creemos en el valor cultural y afectivo de los libros impresos, dándoles una segunda vida útil.',
      icono: '✔'
    },
    {
      titulo: 'Acceso equitativo a la lectura',
      descripcion: 'Apostamos a facilitar el acceso al conocimiento sin depender del costo de los libros nuevos.',
      icono: '✔'
    },
    {
      titulo: 'Comunidad colaborativa',
      descripcion: 'Construimos redes solidarias entre lectores que comparten, intercambian y se apoyan mutuamente.',
      icono: '✔'
    }
  ];
}
