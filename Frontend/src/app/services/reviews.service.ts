import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from './login.service'; // Importa LoginService

// Definimos una interfaz para la estructura de una reseña tal como la recibimos del GET
export interface Resena {
    id?: number; // El ID existe al obtener/actualizar/eliminar
    libro: number; // ID del libro (viene en el GET, se envía en el POST)
    // La API GET devuelve el email del usuario, no el ID directo en un campo 'usuario'
    email_usuario: string;
    comentario: string;
    fecha_creacion?: string; // La API devuelve la fecha, opcional al crear

    // Propiedad para enviar el ID del usuario en el payload del POST/PUT
    // No viene en la respuesta del GET, por eso es opcional aquí
    usuario?: number;

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
    providedIn: 'root'
})
export class ReviewsService {
    // URL base de tu API de reseñas. Asegúrate de que sea la correcta.
    // Según tus últimas pruebas, esta URL funciona para GET y POST desde Angular
    private apiUrl = 'https://mercadolibroweb.onrender.com/api/resenas/';

    // Inyectamos LoginService para obtener el token
    constructor(private http: HttpClient, private loginService: LoginService) { }

    // Método auxiliar para obtener los encabezados con el token de autenticación
    private getAuthHeaders(): HttpHeaders {
        const clienteLogueado = this.loginService.obtenerClienteLogueado();
        // Asegúrate de que clienteLogueado y clienteLogueado.access existan
        const token = clienteLogueado && clienteLogueado.access ? clienteLogueado.access : null;

        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        if (token) {
            // Añade el encabezado de autorización si hay un token
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    }

    // Método para obtener TODAS las reseñas (la API devuelve email_usuario)
    // Usado en la sección "Mis Reseñas" para filtrar en frontend por usuario
    // Y ahora también en "Nuestra Selección" para filtrar por libro
    getResenas(): Observable<Resena[]> {
        // Usamos getAuthHeaders para incluir el token si está disponible
        // La URL es simplemente la base, ya que el backend no filtra por usuario ni por libro en el GET
        return this.http.get<Resena[]>(this.apiUrl, { headers: this.getAuthHeaders() });
    }

    // *** ELIMINADO: getResenasPorLibro ya que el backend no soporta este filtro ***
    // getResenasPorLibro(libroId: number): Observable<Resena[]> {
    //     const url = `${this.apiUrl}?libro=${libroId}`;
    //     return this.http.get<Resena[]>(url, { headers: this.getAuthHeaders() });
    // }


    // Método para crear una nueva reseña
    // Necesita el objeto con libro, usuario (ID) y comentario
    // Usamos Omit para excluir campos que no se envían en el POST
    crearResena(resena: Omit<Resena, 'id' | 'fecha_creacion' | 'email_usuario' | 'libroDetalles'>): Observable<Resena> {
        // Usamos getAuthHeaders para incluir el token
        return this.http.post<Resena>(this.apiUrl, resena, { headers: this.getAuthHeaders() });
    }

    // Método para actualizar una reseña existente
    // Necesita el ID de la reseña y el objeto con libro (ID), usuario (ID) y comentario
    actualizarResena(id: number, resena: Omit<Resena, 'id' | 'fecha_creacion' | 'email_usuario' | 'libroDetalles'>): Observable<Resena> {
        const url = `${this.apiUrl}${id}/`;
        // Usamos getAuthHeaders para incluir el token
        return this.http.put<Resena>(url, resena, { headers: this.getAuthHeaders() });
    }

    // Método para eliminar una reseña
    // Necesita el ID de la reseña a eliminar
    eliminarResena(id: number): Observable<any> {
        const url = `${this.apiUrl}${id}/`;
        // Usamos getAuthHeaders para incluir el token
        return this.http.delete<any>(url, { headers: this.getAuthHeaders() });
    }

    // --- Métodos adicionales que podrías necesitar ---

    // Método para obtener una reseña específica por ID (útil para la edición)
    // Incluimos el encabezado de autenticación
    getResenaPorId(id: number): Observable<Resena> {
        const url = `${this.apiUrl}${id}/`;
        // Usamos getAuthHeaders para incluir el token
        return this.http.get<Resena>(url, { headers: this.getAuthHeaders() });
    }
}
