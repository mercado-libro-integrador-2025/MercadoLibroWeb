import { CommonModule, DatePipe } from '@angular/common'; // Importa DatePipe para formatear la fecha
import { Component, OnInit } from '@angular/core'; // Importa OnInit
import { RouterLink } from '@angular/router';
// Confirma que esta ruta sea correcta según la ubicación de tu archivo reviews.service.ts
import { ReviewsService, Resena, LibroResena } from '../../../services/reviews.service'; // <-- ¡Verifica esta ruta!
import { LoginService } from '../../../services/login.service'; // Importa LoginService
import { ProductoService } from '../../../services/producto.service'; // Importa ProductoService
import { Libro } from '../../../services/models/producto'; // Importa la interfaz Libro
import { HttpErrorResponse } from '@angular/common/http'; // Importa HttpErrorResponse
import { FormsModule } from '@angular/forms'; // Importa FormsModule para usar ngModel en el formulario
import { firstValueFrom } from 'rxjs'; // Importa firstValueFrom

@Component({
  selector: 'app-reviews',
  standalone: true,
  // Agrega HttpClientModule si no está provisto globalmente
  imports: [CommonModule, RouterLink, DatePipe, FormsModule], // Agrega DatePipe y FormsModule a los imports
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit { // Implementa OnInit

  // Propiedad para almacenar las reseñas del usuario logueado
  reviews: Resena[] = [];
  // Propiedad para almacenar la lista de libros para el selector en el formulario
  books: Libro[] = [];
  // Propiedad para almacenar la información del usuario logueado
  // Considera crear una interfaz para el usuario logueado si es compleja
  // Basado en tu output, la estructura es { access: string, refresh: string, user: { id: number, email: string, username: string } }
  clienteLogueado: any;


  // Propiedad para manejar los datos del formulario de reseña (crear/editar)
  // Inicializamos con valores por defecto o vacíos
  reviewForm: { libroId: number | null, comentario: string } = {
    libroId: null,
    comentario: ''
  };

  // Propiedad para saber si estamos editando una reseña existente
  isEditing: boolean = false;
  // Propiedad para almacenar la reseña que se está editando
  editingReviewId: number | null = null;


  // Inyecta los servicios necesarios en el constructor
  constructor(
    private reviewsService: ReviewsService,
    private loginService: LoginService,
    private productoService: ProductoService
  ) { }

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    // 1. Obtener el usuario logueado
    this.clienteLogueado = this.loginService.obtenerClienteLogueado();
    console.log('Usuario logueado en ReviewsComponent:', this.clienteLogueado); // Mantener para verificación

    // ¡CORRECCIÓN ANTERIOR MANTENIDA! Accedemos a clienteLogueado.user?.id
    if (this.clienteLogueado && this.clienteLogueado.user && this.clienteLogueado.user.id) {
      // 2. Cargar las reseñas (ahora se filtrarán en el frontend)
      this.loadUserReviews(this.clienteLogueado.user.id); // Pasamos el ID para el filtro
    } else {
      // Manejar el caso donde no hay usuario logueado (ej: mostrar un mensaje o redirigir)
      console.warn('No hay usuario logueado o su ID no está disponible para cargar reseñas.');
      // Podrías redirigir al login aquí si es necesario
      // this.router.navigate(['/inicio']); // Necesitarías inyectar Router
      // O simplemente no cargar las reseñas y mostrar un mensaje en la UI
    }

    // 3. Cargar la lista de libros para el selector
    this.loadBooks();
  }

  // Método para cargar las reseñas (ahora filtra en el frontend)
  loadUserReviews(userId: number): void {
    // Llamamos al servicio para obtener TODAS las reseñas (asumiendo que el backend no filtra)
    this.reviewsService.getResenasPorUsuario(userId).subscribe({ // Aunque pasamos userId, el backend lo ignora por ahora
      next: (allResenas: Resena[]) => {
        // Filtramos las reseñas en el frontend para mostrar solo las del usuario logueado
        this.reviews = allResenas.filter(resena => resena.usuario === userId); // <-- ¡FILTRADO AQUÍ!

        // Ahora, para cada reseña filtrada, obtenemos el título del libro
        this.fetchBookTitlesForReviews(); // Llama a la función para obtener títulos de las reseñas filtradas
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar las reseñas (filtrando en frontend):', error);
        // Manejar el error (ej: mostrar un mensaje al usuario)
      }
    });
  }

  // Método para obtener los títulos de los libros para cada reseña
  fetchBookTitlesForReviews(): void {
    // Usamos firstValueFrom para convertir el Observable a Promise
    const bookPromises = this.reviews.map(review =>
      firstValueFrom(this.productoService.getLibro(review.libro))
        .then(libro => {
          // Asignamos el objeto libro a la nueva propiedad 'libroDetalles'
          review.libroDetalles = libro as any; // Usamos 'as any' temporalmente si la interfaz Resena no incluye Libro completo
                                       // Lo ideal es que la interfaz Resena tenga una propiedad 'libroDetalles' de tipo LibroResena
        })
        .catch((error: HttpErrorResponse) => {
          console.error(`Error al cargar el libro con ID ${review.libro}:`, error);
          review.libroDetalles = { id: review.libro, titulo: 'Título Desconocido' } as any; // Manejo básico del error
        })
    );

    // Esperamos a que todas las promesas se resuelvan
    Promise.all(bookPromises).then(() => {
      console.log('Títulos de libros cargados para las reseñas filtradas.');
      // Aquí podrías hacer algo después de que todos los títulos se carguen, si es necesario.
    });
  }


  // Método para cargar la lista de libros para el selector
  loadBooks(): void {
    // Usamos searchLibros sin término ni categoría para obtener todos (o la primera página si la API pagina)
    this.productoService.searchLibros('', '').subscribe({
      next: (libros: Libro[]) => {
        this.books = libros;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar la lista de libros:', error);
        // Manejar el error
      }
    });
  }

  // --- Métodos para CRUD ---

  // Método para manejar el envío del formulario (crear o actualizar)
  onSubmitReviewForm(): void {
    // ¡CORRECCIÓN ANTERIOR MANTENIDA! Accedemos a clienteLogueado.user?.id
    if (!this.clienteLogueado || !this.clienteLogueado.user || !this.clienteLogueado.user.id) {
      console.warn('No hay usuario logueado o su ID no está disponible para enviar la reseña.');
      // Mostrar un mensaje al usuario o redirigir al login
      return;
    }

    // Verificar que se haya seleccionado un libro
    if (this.reviewForm.libroId === null) {
       console.warn('Debe seleccionar un libro para dejar una reseña.');
       // Mostrar un mensaje al usuario
       return;
    }

    // Crear el objeto reseña con los datos del formulario
    const reviewData: Omit<Resena, 'id' | 'fecha_creacion' | 'libroDetalles'> = {
      libro: this.reviewForm.libroId, // Ya verificamos que no es null
      usuario: this.clienteLogueado.user.id, // <-- ¡CORRECCIÓN ANTERIOR MANTENIDA!
      comentario: this.reviewForm.comentario
    };

    if (this.isEditing && this.editingReviewId !== null) {
      // Si estamos editando, llamar al servicio para actualizar
      this.reviewsService.actualizarResena(this.editingReviewId, reviewData).subscribe({
        next: (updatedReview: Resena) => {
          console.log('Reseña actualizada con éxito:', updatedReview);
          this.resetForm(); // Resetear el formulario después de actualizar
          // ¡CORRECCIÓN ANTERIOR MANTENIDA! Recargar la lista de reseñas del usuario logueado
          this.loadUserReviews(this.clienteLogueado.user.id);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al actualizar la reseña:', error);
          // Manejar el error (ej: mostrar mensaje al usuario)
        }
      });
    } else {
      // Si no estamos editando, llamar al servicio para crear
      this.reviewsService.crearResena(reviewData).subscribe({
        next: (newReview: Resena) => {
          console.log('Reseña creada con éxito:', newReview);
          this.resetForm(); // Resetear el formulario después de crear
          // ¡CORRECCIÓN ANTERIOR MANTENIDA! Recargar la lista de reseñas del usuario logueado
          this.loadUserReviews(this.clienteLogueado.user.id);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al crear la reseña:', error);
          // Manejar el error (ej: mostrar mensaje al usuario)
        }
      });
    }
  }

  // Método para precargar el formulario con datos de una reseña para edición
  editReview(review: Resena): void {
    console.log('Preparando para editar reseña:', review);
    this.isEditing = true;
    this.editingReviewId = review.id!; // Asumimos que la reseña tiene un ID al editar
    // Precargar el formulario con los datos de la reseña
    this.reviewForm = {
      libroId: review.libro, // Aquí review.libro es el ID del libro
      comentario: review.comentario
    };
  }

  // Método para eliminar una reseña
  deleteReview(reviewId: number): void {
    console.log('Eliminar reseña con ID:', reviewId);
    // Confirmar con el usuario antes de eliminar
    if (confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      this.reviewsService.eliminarResena(reviewId).subscribe({
        next: () => {
          console.log('Reseña eliminada con éxito.');
          // ¡CORRECCIÓN ANTERIOR MANTENIDA! Recargar la lista de reseñas del usuario logueado
          this.loadUserReviews(this.clienteLogueado.user.id);
          // Si estábamos editando la reseña eliminada, resetear el formulario
          if (this.isEditing && this.editingReviewId === reviewId) {
            this.resetForm();
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al eliminar la reseña:', error);
          // Manejar el error
        }
      });
    }
  }

  // Método para cancelar la edición y resetear el formulario
  cancelEditing(): void {
    this.resetForm();
  }

  // Método para resetear el formulario a su estado inicial
  resetForm(): void {
    this.isEditing = false;
    this.editingReviewId = null;
    this.reviewForm = {
      libroId: null,
      comentario: ''
    };
  }
}
