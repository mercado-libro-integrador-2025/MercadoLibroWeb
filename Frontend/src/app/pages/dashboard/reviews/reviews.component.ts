import { CommonModule, DatePipe } from '@angular/common'; 
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReviewsService, Resena } from '../../../services/reviews.service';
import { LoginService } from '../../../services/login.service'; 
import { ProductoService } from '../../../services/producto.service';
import { Libro } from '../../../services/models/producto'; 
import { HttpErrorResponse } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms'; 
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, FormsModule], 
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit { 

  reviews: Resena[] = [];
  books: Libro[] = [];
  
  clienteLogueado: any;

  reviewForm: { libroId: number | null, comentario: string } = {
    libroId: null,
    comentario: ''
  };

  isEditing: boolean = false;
  editingReviewId: number | null = null;

  constructor(
    private reviewsService: ReviewsService,
    private loginService: LoginService,
    private productoService: ProductoService
  ) { }

  ngOnInit(): void {
    this.clienteLogueado = this.loginService.obtenerClienteLogueado();
    console.log('Usuario logueado en ReviewsComponent:', this.clienteLogueado); 

    if (this.clienteLogueado && this.clienteLogueado.user && this.clienteLogueado.user.email) {
      this.loadUserReviews(this.clienteLogueado.user.email); 
    } else {
      console.warn('No hay usuario logueado o su email no está disponible para cargar reseñas.');
    }

    this.loadBooks();
  }

  loadUserReviews(userEmail: string): void { 
    this.reviewsService.getResenas().subscribe({ 
      next: (allResenas: Resena[]) => {
        if (allResenas.length > 0) {
         } else {
             console.log('No hay reseñas recibidas para inspeccionar el campo email_usuario.');
        }


        this.reviews = allResenas.filter(resena => {
            return resena.email_usuario === userEmail; 
        });

        console.log('Reseñas después de filtrar:', this.reviews); 

        this.fetchBookTitlesForReviews();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar las reseñas (filtrando en frontend):', error);
      }
    });
  }

  fetchBookTitlesForReviews(): void {
    const bookPromises = this.reviews.map(review =>
      firstValueFrom(this.productoService.getLibro(review.libro))
        .then(libro => {
          review.libroDetalles = libro as any; 
        })
        .catch((error: HttpErrorResponse) => {
          console.error(`Error al cargar el libro con ID ${review.libro}:`, error);
          review.libroDetalles = { id: review.libro, titulo: 'Título Desconocido' } as any; 
        })
    );

    Promise.all(bookPromises).then(() => {
      console.log('Títulos de libros cargados para las reseñas.'); 
    });
  }

  loadBooks(): void {
    this.productoService.searchLibros('').subscribe({
      next: (libros: Libro[]) => {
        this.books = libros;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar la lista de libros:', error);
      }
    });
  }

  onSubmitReviewForm(): void {
    if (!this.clienteLogueado || !this.clienteLogueado.user || !this.clienteLogueado.user.id || !this.clienteLogueado.user.email) {
      console.warn('No hay usuario logueado o su información (ID/email) no está disponible para enviar la reseña.');
      return;
    }

    if (this.reviewForm.libroId === null) {
       console.warn('Debe seleccionar un libro para dejar una reseña.');
       return;
    }

    const reviewData: Omit<Resena, 'id' | 'fecha_creacion' | 'email_usuario' | 'libroDetalles'> = {
      libro: this.reviewForm.libroId, 
      usuario: this.clienteLogueado.user.id, 
      comentario: this.reviewForm.comentario
    };

    if (this.isEditing && this.editingReviewId !== null) {
      this.reviewsService.actualizarResena(this.editingReviewId, reviewData).subscribe({
        next: (updatedReview: Resena) => {
          console.log('Reseña actualizada con éxito:', updatedReview);
          this.resetForm(); 
          this.loadUserReviews(this.clienteLogueado.user.email); 
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al actualizar la reseña:', error);
        }
      });
    } else {
      this.reviewsService.crearResena(reviewData).subscribe({
        next: (newReview: Resena) => {
          console.log('Reseña creada con éxito:', newReview);
          this.resetForm(); 
          this.loadUserReviews(this.clienteLogueado.user.email); 
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al crear la reseña:', error);
        }
      });
    }
  }

  editReview(review: Resena): void {
    console.log('Preparando para editar reseña:', review);
    this.isEditing = true;
    this.editingReviewId = review.id!; 
    this.reviewForm = {
      libroId: review.libro, 
      comentario: review.comentario
    };
  }

  deleteReview(reviewId: number): void {
    console.log('Eliminar reseña con ID:', reviewId);
    if (confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      this.reviewsService.eliminarResena(reviewId).subscribe({
        next: () => {
          console.log('Reseña eliminada con éxito.');
          this.loadUserReviews(this.clienteLogueado.user.email); // Pasamos el EMAIL para el filtro
          if (this.isEditing && this.editingReviewId === reviewId) {
            this.resetForm();
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al eliminar la reseña:', error);
        }
      });
    }
  }

  cancelEditing(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.isEditing = false;
    this.editingReviewId = null;
    this.reviewForm = {
      libroId: null,
      comentario: ''
    };
  }
}
