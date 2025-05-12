import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuienesService {
  private datosQuienes: any[];

  constructor() {
    this.datosQuienes = [];
  }

  getParrafoQuienesSomos(): string {
    return `tu destino literario preferido donde las palabras cobran vida y la imaginación se desborda.
    Somos mucho más que una tienda de libros;
    somos un refugio para los amantes de la lectura y un faro para aquellos que buscan descubrir nuevas historias
    y mundos por explorar.`;
  }

  getParrafoNuestraSeleccion(): string {
    return `Nuestra cuidadosa selección de libros abarca desde clásicos intemporales hasta las
    obras más contemporáneas y vanguardistas. Encontrarás un rincón para cada género: desde la fantasía épica
    hasta
    la poesía lírica, desde los misterios más oscuros hasta las historias de amor más conmovedoras.
    Cada libro que ofrecemos ha sido elegido con el compromiso de proporcionar experiencias de lectura
    enriquecedoras.`;
  }

  getParrafoNuestraPasion(): string {
    return `la pasión por la literatura fluye en nuestras venas.
    Desde el momento en que abrimos nuestras puertas virtuales, nos hemos dedicado a compartir el amor por la
    lectura
    y a celebrar la diversidad de voces y géneros literarios. Creemos que los libros tienen el poder de
    transformar vidas
    y abrir puertas a innumerables aventuras.`;
  }

  getParrafoNuestroCompromiso(): string {
    return `valoramos profundamente a nuestros clientes y su amor por la
    lectura.
    Nos comprometemos a brindar un servicio excepcional, recomendaciones personalizadas y una experiencia de
    compra
    en línea sin igual. Además, nos esforzamos por apoyar a autores emergentes y pequeñas editoriales para dar
    vida
    a nuevas voces literarios.`;
  } 

  guardarDatosQuienes(): any {
    return this.datosQuienes = [
      this.getParrafoQuienesSomos(),
      this.getParrafoNuestraSeleccion(),
      this.getParrafoNuestraPasion(),
      this.getParrafoNuestroCompromiso()
    ];
  }
}