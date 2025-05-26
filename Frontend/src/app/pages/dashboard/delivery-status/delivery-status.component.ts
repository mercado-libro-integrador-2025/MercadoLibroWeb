import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-delivery-status',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './delivery-status.component.html',
  styleUrls: ['./delivery-status.component.css']
})
export class DeliveryStatus implements OnInit {
  order: any = null;

  constructor(private loginService: LoginService, private http: HttpClient) {}

  ngOnInit(): void {
  const cliente = this.loginService.obtenerClienteLogueado();
  if (cliente) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${cliente.access}`
    });

    const url = `https://mercadolibroweb.onrender.com/api/pedidos/usuario/${cliente.user.id}/`;

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (response) => {
        if (response.length > 0) {
          const ultimoPedido = response[response.length - 1];
          this.order = {
            id: ultimoPedido.id,
            fecha_pedido: ultimoPedido.fecha_pedido,
            estado: ultimoPedido.estado
          };
        }
      },
      error: (err) => {
        console.error('Error al obtener estado del pedido:', err);
      }
    });
  }
}}
