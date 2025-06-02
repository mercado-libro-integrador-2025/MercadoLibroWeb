import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { PedidoService } from '../../../services/pedido.service'; 

@Component({
  selector: 'app-delivery-status',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './delivery-status.component.html',
  styleUrls: ['./delivery-status.component.css']
})
export class DeliveryStatus implements OnInit {
  order: any = null; 

  constructor(
    private loginService: LoginService,
    private pedidoService: PedidoService 
  ) {}

  ngOnInit(): void {
    const cliente = this.loginService.obtenerClienteLogueado();

    if (cliente && cliente.access) { 
      this.pedidoService.getPedidos(cliente.access).subscribe({
        next: (response) => {
          if (response && response.length > 0) {
            response.sort((a, b) => new Date(a.fecha_pedido).getTime() - new Date(b.fecha_pedido).getTime());

            const ultimoPedido = response[response.length - 1]; 
            this.order = {
              id: ultimoPedido.id,
              fecha_pedido: ultimoPedido.fecha_pedido,
              estado: ultimoPedido.estado,
            };
            console.log('Último pedido obtenido:', this.order); 
          } else {
            this.order = null; 
            console.log('No se encontraron pedidos para el usuario.');
          }
        },
        error: (err) => {
          console.error('Error al obtener estado del pedido:', err);
        }
      });
    } else {
      console.warn('No hay cliente logueado o token de acceso.');
    }
  }
}