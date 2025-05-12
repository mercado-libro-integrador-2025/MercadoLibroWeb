import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  detallesPedidos: any[] = [];

  constructor(private loginService: LoginService, private http: HttpClient) {}

  ngOnInit(): void {
    const cliente = this.loginService.obtenerClienteLogueado();
    if (cliente) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${cliente.access}`
      });

      const url = `https://mercadolibroweb.onrender.com/api/pedidos/usuario/${cliente.user.id}`;

      this.http.get<any[]>(url, { headers }).subscribe({
        next: (response) => {
          // Mapeamos cada item si es necesario
          this.detallesPedidos = response.flatMap((pedido: any) =>
            pedido.items.map((item: any) => ({
              direccion_envio: pedido.direccion_envio,
              estado_pedido: pedido.estado,
              fecha_pedido: pedido.fecha_pedido,
              titulo_libro: item.libro?.nombre || 'Desconocido',
              cantidad: item.cantidad,
              precio_total: item.precio_total
            }))
          );
        },
        error: (err) => {
          console.error('Error al obtener historial de pedidos:', err);
        }
      });
    }
  }
}
