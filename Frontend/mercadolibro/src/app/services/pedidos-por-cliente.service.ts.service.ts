import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidosPorClienteService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  obtenerDetallePedido(clienteId: number): Observable<any> {
    const url = `${this.apiUrl}/historial-pedido/?cliente_id=${clienteId}`;
    return this.http.get(url, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }
}
