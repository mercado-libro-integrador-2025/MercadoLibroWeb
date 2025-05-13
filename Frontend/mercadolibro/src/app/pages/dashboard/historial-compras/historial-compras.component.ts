import { Component, OnInit } from '@angular/core';
import { PedidosPorClienteService } from '../../../services/pedidos-por-cliente.service.ts.service';
import { LoginService } from '../../../services/login.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-historial-compras',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './historial-compras.component.html',
    styleUrls: ['./historial-compras.component.css']
})
export class HistorialComprasComponent implements OnInit {
    detallesPedidos: any[] = [];

    constructor(
        private pedidosPorClienteService: PedidosPorClienteService,
        private loginService: LoginService
    ) { }

    ngOnInit(): void {
        // const clienteLogueado = this.loginService.obtenerClienteLogueado();
        // if (clienteLogueado && clienteLogueado.id_cliente) {
        //     const clienteId = clienteLogueado.id_cliente;
        //     this.pedidosPorClienteService.obtenerDetallePedido(clienteId).subscribe(
        //         (data: any) => {
        //             console.log(data); // Imprime la respuesta del servicio en la consola
        //             if (data && data.detalles_pedidos && data.detalles_pedidos.length > 0) {
        //                 this.detallesPedidos = data.detalles_pedidos;
        //             } else {
        //                 console.log('El cliente no tiene pedidos.');
        //                 this.detallesPedidos = [];
        //             }
        //         },
        //         (error: any) => {
        //             console.error('Error al obtener el detalle del pedido:', error);
        //         }
        //     );
        // } else {
        //     console.error('Cliente no logueado o ID de cliente no disponible');
        // }
    }
}
