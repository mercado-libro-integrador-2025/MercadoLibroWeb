import { Component, OnInit } from "@angular/core";
import { Libro } from "../../../services/models/producto";
import { ProductoService } from "../../../services/producto.service";
import { RouterLink } from "@angular/router";
import { CategoriaComponent } from "../categoria/categoria.component";
import { DescripcionComponent } from "../descripcion/descripcion.component";
import { CarritoService, CarritoItem } from "../../../services/carrito.service";
import { HttpErrorResponse } from "@angular/common/http"; // Importa HttpErrorResponse


@Component({
  selector: 'app-product',
   standalone: true,
  templateUrl: './producto.component.html',
   styleUrls: ['./producto.component.css'],
   imports: [RouterLink, CategoriaComponent, DescripcionComponent]
})
export class ProductoComponent implements OnInit {

  libros: Libro[] = [];

  constructor(private productoService: ProductoService, private carritoService: CarritoService) { }

  ngOnInit(): void {
    // El método buscarLibros se llama desde el componente CategoriaComponent
    // cuando se inicializa o se realiza una búsqueda.
    // Si quieres cargar todos los libros al iniciar la página, puedes descomentar y usar esto:
    // this.loadAllBooks();
    // O asegúrate de que CategoriaComponent emite el evento 'buscar' al iniciar.
 }

 // Método opcional para cargar todos los libros al inicio
 loadAllBooks(): void {
    this.productoService.searchLibros('', '').subscribe({
        next: (libros: Libro[]) => {
            this.libros = libros;
            console.log('Libros cargados al iniciar:', this.libros); // Log al cargar todos
            if (this.libros.length > 0) {
                console.log('Valor de portada del primer libro:', this.libros[0].portada); // <-- LOG para portada
            }
        },
        error: (error: HttpErrorResponse) => {
            console.error('Error al cargar todos los libros:', error);
        }
    });
 }


  anadirAlCarrito(libro: Libro): void {
    if (libro.stock > 0) {
      const nuevoItem: CarritoItem = {
        titulo: libro.titulo,
        precio: libro.precio,
        cantidad: 1
      };
      this.carritoService.agregarProducto(nuevoItem);
      libro.stock--;
   } else {
      alert('El libro seleccionado no tiene stock disponible.');
   }
   }

  buscarLibros(params: { termino: string, categoria: string }): void {
    this.productoService.searchLibros(params.termino, params.categoria).subscribe({
        next: (libros: Libro[]) => {
            this.libros = libros;
            console.log('Libros encontrados en la búsqueda:', this.libros); // Log al buscar
            if (this.libros.length > 0) {
                console.log('Valor de portada del primer libro encontrado:', this.libros[0].portada); // <-- LOG para portada
            } else {
                console.log('No se encontraron libros.');
            }
        },
        error: (error: HttpErrorResponse) => {
            console.error('Error en la búsqueda de libros:', error);
        }
    });
   }

  // Método para extraer la URL correcta de la cadena de portada mal formada
  getCorrectImageUrl(portada: string): string {
    // Busca la posición donde comienza la URL HTTPS
    const startIndex = portada.indexOf('https://');
    // Si encuentra 'https://', devuelve la subcadena desde ese punto
    if (startIndex !== -1) {
      return portada.substring(startIndex);
    }
    // Si no encuentra 'https://', devuelve la cadena original 
    console.warn('Formato de URL de portada inesperado:', portada);
    return portada; // O una URL de imagen de placeholder si falla
  }
}
