import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { Contacto, ApiResponse } from '../services/models/contacto.models';  // Ajustá la ruta según tu proyecto

@Injectable({
  providedIn: 'root' 
})
export class ContactoService {

  private baseUrl = 'https://mercadolibroweb.onrender.com'; 
  private submitApiUrl = `${this.baseUrl}/api/contacto/`; 

  constructor(private http: HttpClient) {} 

  // Aquí debe devolver Observable<ApiResponse> porque la API responde con { success, message }
  enviarContacto(data: Contacto): Observable<ApiResponse> {
    console.log('Enviando datos del formulario a la API:', this.submitApiUrl, data);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return this.http.post<ApiResponse>(this.submitApiUrl, data, httpOptions);
  }
}
