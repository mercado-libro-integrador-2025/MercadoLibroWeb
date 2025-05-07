import { CommonModule, DatePipe } from '@angular/common'; // Importa DatePipe para formatear la fecha
import { Component, OnInit } from '@angular/core'; // Importa OnInit
import { RouterLink } from '@angular/router';
import { ReviewsService, Resena, LibroResena } from '../../../services/reviews.service';
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

    // Verificamos si el usuario está logueado y tiene email
    if (this.clienteLogueado && this.clienteLogueado.user && this.clienteLogueado.user.email) {
      // 2. Cargar las reseñas y filtrar en frontend por email
      this.loadUserReviews(this.clienteLogueado.user.email); // Pasamos el EMAIL para el filtro
    } else {
      // Manejar el caso donde no hay usuario logueado o su email no está disponible
      console.warn('No hay usuario logueado o su email no está disponible para cargar reseñas.');
      // Podrías redirigir al login aquí si es necesario
      // this.router.navigate(['/inicio']); // Necesitarías inyectar Router
      // O simplemente no cargar las reseñas y mostrar un mensaje en la UI
    }

    // 3. Cargar la lista de libros para el selector
    this.loadBooks();
  }

  // Método para cargar las reseñas y filtrar en el frontend por email
  loadUserReviews(userEmail: string): void { // Ahora recibe el EMAIL
    // Llamamos al servicio para obtener TODAS las reseñas (la API devuelve email_usuario)
    // Usamos la URL donde el GET funciona para listar (https://mercadolibroweb.onrender.com/api/resenas/)
    this.reviewsService.getResenas().subscribe({ // No pasamos parámetro de usuario al servicio
      next: (allResenas: Resena[]) => {
        console.log('Reseñas recibidas de la API (antes de filtrar):', allResenas); // <-- LOG 1: Todas las reseñas
        console.log('Email del usuario logueado (para filtrar):', userEmail); // <-- LOG 2: Email del usuario logueado

        // *** REACTIVAMOS EL FILTRADO PARA MOSTRAR SOLO LAS RESEÑAS DEL USUARIO LOGUEADO POR EMAIL ***
        // Añadir logs para inspeccionar el valor y tipo de resena.email_usuario
        if (allResenas.length > 0) {
            console.log('Tipo de resena.email_usuario en la primera reseña:', typeof allResenas[0].email_usuario); // <-- LOG 3: Tipo
            console.log('Valor de resena.email_usuario en la primera reseña:', allResenas[0].email_usuario); // <-- LOG 4: Valor
        } else {
             console.log('No hay reseñas recibidas para inspeccionar el campo email_usuario.');
        }


        this.reviews = allResenas.filter(resena => {
            // Comparamos resena.email_usuario con el email del usuario logueado
            // console.log(`Comparando resena.email_usuario (${resena.email_usuario}, tipo: ${typeof resena.email_usuario}) con userEmail (${userEmail}, tipo: ${typeof userEmail})`);
            return resena.email_usuario === userEmail; // <-- ¡FILTRADO AJUSTADO AQUÍ!
        });

        console.log('Reseñas después de filtrar:', this.reviews); // <-- LOG 5: Reseñas después del filtro


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
      console.log('Títulos de libros cargados para las reseñas.'); // Mensaje ajustado
      // Aquí podrías hacer algo después de que todos los títulos se carguen, si es necesario.
    });
  }


  // Método para cargar la lista de libros para el selector
  loadBooks(): void {
    // Usamos searchLibros sin término ni categoría para obtener todos (o la primera página si la API pagina)
    // Nota: La URL del servicio productoService.apiUrl debe estar configurada a la URL correcta de la API de libros.
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
    // Verificamos si el usuario está logueado y tiene email e ID
    if (!this.clienteLogueado || !this.clienteLogueado.user || !this.clienteLogueado.user.id || !this.clienteLogueado.user.email) {
      console.warn('No hay usuario logueado o su información (ID/email) no está disponible para enviar la reseña.');
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
    // Enviamos el ID del usuario en el campo 'usuario' para el backend
    const reviewData: Omit<Resena, 'id' | 'fecha_creacion' | 'email_usuario' | 'libroDetalles'> = {
      libro: this.reviewForm.libroId, // Ya verificamos que no es null
      usuario: this.clienteLogueado.user.id, // <-- Enviamos el ID del usuario
      comentario: this.reviewForm.comentario
    };

    // Nota: Aquí el servicio reviewsService.apiUrl debe estar configurado a la URL donde el POST funciona.
    if (this.isEditing && this.editingReviewId !== null) {
      // Si estamos editando, llamar al servicio para actualizar
      this.reviewsService.actualizarResena(this.editingReviewId, reviewData).subscribe({
        next: (updatedReview: Resena) => {
          console.log('Reseña actualizada con éxito:', updatedReview);
          this.resetForm(); // Resetear el formulario después de actualizar
          // Recargar la lista de reseñas (ahora con filtro por email en frontend)
          this.loadUserReviews(this.clienteLogueado.user.email); // Pasamos el EMAIL para el filtro
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
          // Recargar la lista de reseñas (ahora con filtro por email en frontend)
          this.loadUserReviews(this.clienteLogueado.user.email); // Pasamos el EMAIL para el filtro
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
      // Nota: Aquí el servicio reviewsService.apiUrl debe estar configurado a la URL donde el DELETE funciona.
      this.reviewsService.eliminarResena(reviewId).subscribe({
        next: () => {
          console.log('Reseña eliminada con éxito.');
          // Recargar la lista de reseñas (ahora con filtro por email en frontend)
          this.loadUserReviews(this.clienteLogueado.user.email); // Pasamos el EMAIL para el filtro
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
