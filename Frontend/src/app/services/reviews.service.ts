import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definimos una interfaz para la estructura de una reseña
// Esto ayuda a tener tipado fuerte en Angular
export interface Resena {
  id?: number; // El ID es opcional al crear, pero existe al obtener/actualizar
  libro: number; // ID del libro (asumimos que la API espera el ID)
  usuario: number; // ID del usuario (asumimos que la API espera el ID)
  comentario: string;
  fecha_creacion?: string; // La API devuelve la fecha, opcional al crear
  // calificacion?: number; // Si en el futuro el backend soporta calificación
  // Propiedad temporal para almacenar el objeto Libro asociado a la reseña
  // Esto es necesario porque la API de reseñas solo devuelve el ID del libro
  libroDetalles?: LibroResena;
}

// Definimos una interfaz para un libro, solo con los campos que necesitamos mostrar en la reseña
// Asumimos que la API de libros devuelve al menos 'id' y 'titulo'
export interface LibroResena {
  id: number;
  titulo: string;
  // Otros campos si se necesitan para mostrar en la reseña
}


@Injectable({
  providedIn: 'root' // <-- ¡Importante que esté aquí!
})
export class ReviewsService {
  // URL base de tu API de reseñas. Asegúrate de que sea la correcta.
  // Basado en el endpoint que me pasaste: https://backend-mercado-libro-mobile.onrender.com/api/resenas/
  private apiUrl = 'https://backend-mercado-libro-mobile.onrender.com/api/resenas/';

  constructor(private http: HttpClient) { }

  // Método para obtener las reseñas de un usuario específico
  // Asumimos que la API soporta filtrar por usuario, por ejemplo, con un parámetro de consulta ?usuario=<id>
  // Si no lo soporta, tendremos que filtrar en el frontend después de obtener todas las reseñas (menos eficiente)
  // O modificar el backend para que soporte este filtro (recomendado)
  // Por ahora, asumimos que el backend puede filtrar por usuario ID.
  // Si la API GET /api/resenas/ NO filtra por usuario, tendremos que cambiar este método.
  getResenasPorUsuario(usuarioId: number): Observable<Resena[]> {
    const url = `${this.apiUrl}?usuario=${usuarioId}`;
    // Aquí podrías necesitar agregar headers de autenticación si la API lo requiere
    // const headers = new HttpHeaders({ 'Authorization': 'Bearer TU_TOKEN_AQUI' });
    // return this.http.get<Resena[]>(url, { headers: headers });
    return this.http.get<Resena[]>(url);
  }

  // Método para crear una nueva reseña
  // Necesita el objeto Resena (sin id y fecha_creacion, pero con libro, usuario y comentario)
  crearResena(resena: Omit<Resena, 'id' | 'fecha_creacion' | 'libroDetalles'>): Observable<Resena> {
    // Aquí necesitarás agregar headers de autenticación (ej: Token o JWT)
    // const headers = new HttpHeaders({ 'Authorization': 'Bearer TU_TOKEN_AQUI', 'Content-Type': 'application/json' });
    // return this.http.post<Resena>(this.apiUrl, resena, { headers: headers });
     const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); // Solo Content-Type por ahora
     return this.http.post<Resena>(this.apiUrl, resena, { headers: headers });
  }

  // Método para actualizar una reseña existente
  // Necesita el ID de la reseña y el objeto Resena con los datos actualizados
  actualizarResena(id: number, resena: Omit<Resena, 'id' | 'fecha_creacion' | 'libroDetalles'>): Observable<Resena> {
    const url = `${this.apiUrl}${id}/`;
    // Aquí necesitarás agregar headers de autenticación
    // const headers = new HttpHeaders({ 'Authorization': 'Bearer TU_TOKEN_AQUI', 'Content-Type': 'application/json' });
    // return this.http.put<Resena>(url, resena, { headers: headers });
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); // Solo Content-Type por ahora
    return this.http.put<Resena>(url, resena, { headers: headers });
  }

  // Método para eliminar una reseña
  // Necesita el ID de la reseña a eliminar
  eliminarResena(id: number): Observable<any> {
    const url = `${this.apiUrl}${id}/`;
    // Aquí necesitarás agregar headers de autenticación
    // const headers = new HttpHeaders({ 'Authorization': 'Bearer TU_TOKEN_AQUI' });
    // return this.http.delete<any>(url, { headers: headers });
    return this.http.delete<any>(url);
  }

  // --- Métodos adicionales que podrías necesitar ---

  // Método para obtener una reseña específica por ID (útil para la edición)
  getResenaPorId(id: number): Observable<Resena> {
    const url = `${this.apiUrl}${id}/`;
     // Aquí podrías necesitar agregar headers de autenticación
    // const headers = new HttpHeaders({ 'Authorization': 'Bearer TU_TOKEN_AQUI' });
    // return this.http.get<Resena>(url, { headers: headers });
    return this.http.get<Resena>(url);
  }
}
