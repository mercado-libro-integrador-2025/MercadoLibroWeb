import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Observable } from 'rxjs';

export interface Contacto {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}

@Injectable({
  providedIn: 'root' 
})
export class ContactoService {

  
  private baseUrl = 'https://mercadolibroweb.onrender.com'; 
  private submitApiUrl = `${this.baseUrl}/api/contacto/`; 

  
  datosContacto = [
    { tipo: 'telefono', telefono: '+54 9 351 XXXXXX' }, 
    { tipo: 'ubicacion', ubicacion: 'Calle Falsa 123, Córdoba, Argentina' },
    { tipo: 'facebook', facebook: 'https://www.facebook.com/MercadoLibro' }, 
    { tipo: 'instagram', instagram: 'https://www.instagram.com/MercadoLibro' }, 
    { tipo: 'twitter', twitter: 'https://twitter.com/MercadoLibro' }, 
    { tipo: 'linkedin', linkedin: 'https://www.linkedin.com/company/MercadoLibro' } 
  ];


  constructor(private http: HttpClient) {} 
  getDatosContacto() {
     
     return this.datosContacto;
  }


  
  enviarContacto(data: Contacto): Observable<Contacto> {
    console.log('Enviando datos del formulario a la API:', this.submitApiUrl, data);

   
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        
      })
    };

    
    return this.http.post<Contacto>(this.submitApiUrl, data, httpOptions);
     
  }

 
}
