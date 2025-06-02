import { Component, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { Libro } from "../../../services/models/producto"; 
import { ProductoService } from "../../../services/producto.service";
import { RouterLink } from "@angular/router";
import { SearchComponent } from "../search/search.component";
import { CheckoutService, CarritoItem } from "../../../services/checkout.service";
import { HttpErrorResponse } from "@angular/common/http"; 
import { ReviewsService, Resena } from "../../../services/reviews.service"; 

@Component({
    selector: 'app-product',
    standalone: true,
    templateUrl: './producto.component.html',
    styleUrls: ['./producto.component.css'],
    imports: [RouterLink, SearchComponent, CommonModule] 
})
export class ProductoComponent implements OnInit {

    libros: Libro[] = [];

    // Reseñas
    showReviewsModal: boolean = false;
    selectedBook: Libro | null = null;
    selectedBookReviews: Resena[] = [];

    // Modal de descripción
    showDescripcionModal: boolean = false;
    descripcionActual: string = '';

    constructor(
        private productoService: ProductoService,
        private carritoService: CheckoutService,
        private reviewsService: ReviewsService
    ) { }

    ngOnInit(): void { 
        this.loadAllBooks(); 
    }

    loadAllBooks(): void {
        this.productoService.searchLibros('', '').subscribe({
            next: (libros: Libro[]) => {
                this.libros = libros;
                console.log('Libros cargados al iniciar:', this.libros);
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
                console.log('Libros encontrados en la búsqueda:', this.libros);
                if (this.libros.length > 0) {
                    console.log('Valor de portada del primer libro encontrado:', this.libros[0].portada);
                } else {
                    console.log('No se encontraron libros.');
                }
            },
            error: (error: HttpErrorResponse) => {
                console.error('Error en la búsqueda de libros:', error);
            }
        });
    }

    getCorrectImageUrl(portada: string): string {
        const startIndex = portada.indexOf('https://');
        if (startIndex !== -1) {
            return portada.substring(startIndex);
        }
        console.warn('Formato de URL de portada inesperado o incompleto:', portada);
        return portada;
    }

    verDescripcion(libro: Libro): void {
    this.selectedBook = libro;

    console.log('Libro seleccionado:', libro);
    console.log('Libro seleccionado titulo:', this.selectedBook?.titulo); 

    this.descripcionActual = libro.descripcion || 'Este libro no tiene descripción disponible.';
    this.showDescripcionModal = true;
    }


    cerrarModalDescripcion(): void {
        this.showDescripcionModal = false;
        this.descripcionActual = '';
    }

    // Reseñas
    viewReviews(libro: Libro): void {
        this.selectedBook = libro;
        this.selectedBookReviews = [];

        this.reviewsService.getResenas().subscribe({
            next: (allResenas: Resena[]) => {
                this.selectedBookReviews = allResenas.filter(resena => resena.libro === libro.id_libro);
                console.log(`Reseñas filtradas para el libro "${libro.titulo}":`, this.selectedBookReviews);
                this.showReviewsModal = true;
            },
            error: (error: HttpErrorResponse) => {
                console.error(`Error al cargar o filtrar reseñas para el libro "${libro.titulo}":`, error);
                this.selectedBookReviews = [];
                this.showReviewsModal = true;
            }
        });
    }

    closeReviewsModal(): void {
        this.showReviewsModal = false;
        this.selectedBook = null;
        this.selectedBookReviews = [];
    }
}
