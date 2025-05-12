export interface Pedido {
    usuario_cliente: number;
    estado_pedido: string;
    fecha_pedido?: string;
    direccion_envio: number;
    forma_envio: number;
    forma_pago: number;
}
