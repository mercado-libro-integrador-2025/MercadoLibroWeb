import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { Contacto } from '../services/models/contacto.models';  

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  private baseUrl = 'https://mercadolibroweb.onrender.com';
  private submitApiUrl = `${this.baseUrl}/api/contacto/`;

  constructor(private http: HttpClient) {}

  enviarContacto(data: Contacto): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post(this.submitApiUrl, data, httpOptions);
  }
}
