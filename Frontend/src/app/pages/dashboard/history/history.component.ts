import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe, NgFor } from '@angular/common'; 
import { LoginService } from '../../../services/login.service';
import { PedidoService } from '../../../services/pedido.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, NgFor], 
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  detallesPedidos: any[] = []; 
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private loginService: LoginService,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    const cliente = this.loginService.obtenerClienteLogueado();

    if (cliente && cliente.access) {
      this.isLoading = true;
      this.error = null;

      this.pedidoService.getPedidos(cliente.access).subscribe({
        next: (pedidosResponse) => {
          if (pedidosResponse && pedidosResponse.length > 0) {
            this.detallesPedidos = pedidosResponse.map((pedido: any) => ({
              id: pedido.id,
              fecha_pedido: pedido.fecha_pedido, 
              direccion_envio: pedido.direccion ?
                                `${pedido.direccion.calle || ''} ${pedido.direccion.numero || ''}, ${pedido.direccion.localidad || ''}, ${pedido.direccion.provincia || ''}`.trim() :
                                'N/A',
              estado: pedido.estado,
              total: pedido.total
            }));

            this.detallesPedidos.sort((a, b) => new Date(b.fecha_pedido).getTime() - new Date(a.fecha_pedido).getTime());

            console.log('Historial de pedidos procesado:', this.detallesPedidos);
          } else {
            this.detallesPedidos = [];
            console.log('No se encontraron pedidos en su historial.');
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al obtener historial de pedidos:', err);
          this.error = 'No se pudo cargar el historial de pedidos. Por favor, inténtelo de nuevo más tarde.';
          this.isLoading = false;
        }
      });
    } else {
      console.warn('No hay cliente logueado o token de acceso. No se pueden cargar los pedidos.');
      this.isLoading = false;
      this.error = 'Debe iniciar sesión para ver su historial de pedidos.';
    }
  }
}