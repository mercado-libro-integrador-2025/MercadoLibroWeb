import { Component, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { Libro } from "../../../services/models/producto"; 
import { ProductoService } from "../../../services/producto.service";
import { RouterLink } from "@angular/router";
import { CategoriaComponent } from "../categoria/categoria.component";
import { DescripcionComponent } from "../descripcion/descripcion.component";
import { CheckoutService, CarritoItem } from "../../../services/checkout.service";
import { HttpErrorResponse } from "@angular/common/http"; 
import { ReviewsService, Resena } from "../../../services/reviews.service"; 


@Component({
    selector: 'app-product',
    standalone: true,
    templateUrl: './producto.component.html',
    styleUrls: ['./producto.component.css'],
    imports: [RouterLink, CategoriaComponent, DescripcionComponent, CommonModule]
})
export class ProductoComponent implements OnInit {

    libros: Libro[] = [];

    // Propiedades para la funcionalidad de reseñas por libro (ahora para modal)
    showReviewsModal: boolean = false; // Controla la visibilidad del modal de reseñas
    selectedBook: Libro | null = null; // Almacena el libro cuyas reseñas se muestran en el modal
    selectedBookReviews: Resena[] = []; // Almacena las reseñas filtradas del libro seleccionado


    constructor(
        private productoService: ProductoService,
        private carritoService: CheckoutService,
        private reviewsService: ReviewsService // Inyecta ReviewsService
    ) { }

    ngOnInit(): void {
    }

    loadAllBooks(): void {
        this.productoService.searchLibros('', '').subscribe({
            next: (libros: Libro[]) => {
                this.libros = libros;
                console.log('Libros cargados al iniciar:', this.libros); 
                if (this.libros.length > 0) {
                    console.log('Valor de portada del primer libro:', this.libros[0].portada); 
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
        // Si no encuentra 'https://', devuelve la cadena original (o una URL de imagen por defecto si prefieres)
        console.warn('Formato de URL de portada inesperado:', portada);
        return portada; // O una URL de imagen de placeholder si falla
    }

    // Método para ver las reseñas de un libro específico en un modal
    viewReviews(libro: Libro): void {
        // Establecemos el libro seleccionado
        this.selectedBook = libro;
        this.selectedBookReviews = []; // Limpiamos la lista de reseñas anteriores

        // Llamamos al ReviewsService para obtener TODAS las reseñas
        // Y luego filtramos en el frontend por el ID del libro seleccionado
        this.reviewsService.getResenas().subscribe({ // Llama a getResenas() para obtener todas
            next: (allResenas: Resena[]) => {
                // Filtramos las reseñas por el ID del libro seleccionado
                this.selectedBookReviews = allResenas.filter(resena => resena.libro === libro.id_libro); // <-- ¡FILTRADO POR LIBRO AQUÍ!
                console.log(`Reseñas filtradas para el libro "${libro.titulo}":`, this.selectedBookReviews);

                // Mostramos el modal una vez que las reseñas se han cargado y filtrado
                this.showReviewsModal = true;
            },
            error: (error: HttpErrorResponse) => {
                console.error(`Error al cargar o filtrar reseñas para el libro "${libro.titulo}":`, error);
                // Manejar el error, quizás mostrar un mensaje al usuario
                // Podrías mostrar el modal con un mensaje de error si falla la carga
                this.selectedBookReviews = []; // Asegurarse de que la lista esté vacía en caso de error
                this.showReviewsModal = true; // Mostrar el modal para informar del error
            }
        });
    }

    // Método para cerrar el modal de reseñas
    closeReviewsModal(): void {
        this.showReviewsModal = false;
        this.selectedBook = null;
        this.selectedBookReviews = [];
    }
}
