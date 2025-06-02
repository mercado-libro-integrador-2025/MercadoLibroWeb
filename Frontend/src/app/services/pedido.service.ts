// src/app/services/pedido.service.ts

import { HttpClient, HttpHeaders } from '@angular/common/http'; // Importa HttpHeaders
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private baseUrl = 'https://mercadolibroweb.onrender.com/api/pedidos/';

  constructor(private http: HttpClient) {}

  getPedidos(token: string): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(this.baseUrl, { headers });
  }

  getPedidoById(pedidoId: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.baseUrl}${pedidoId}/`, { headers });
  }
}