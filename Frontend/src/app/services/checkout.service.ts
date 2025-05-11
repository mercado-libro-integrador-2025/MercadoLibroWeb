import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from './login.service';

export interface CarritoItem {
  titulo: string;
  precio: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})

export class CheckoutService {
  private _carrito = new BehaviorSubject<CarritoItem[]>([]);
  private _cantidadProductos = new BehaviorSubject<number>(0);
  carrito = this._carrito.asObservable();
  cantidadProductos = this._cantidadProductos.asObservable();

  private apiUrl = 'https://mercadolibroweb.onrender.com/api';
  private direccionSeleccionada: string = '';

  constructor(private http: HttpClient, private loginService: LoginService) {}

  agregarProducto(nuevoItem: CarritoItem): void {
    nuevoItem.precio = parseFloat(nuevoItem.precio.toString());
    const carritoActual = this._carrito.getValue();
    const productoExistente = carritoActual.find(item => item.titulo === nuevoItem.titulo);

    if (productoExistente) {
      productoExistente.cantidad += nuevoItem.cantidad;
    } else {
      carritoActual.push(nuevoItem);
    }

    this._carrito.next(carritoActual);
    this.actualizarCantidadProductos();
  }

  actualizarCantidadProductos(): void {
    const carrito = this._carrito.getValue();
    const cantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    this._cantidadProductos.next(cantidad);
  }

  obtenerCarrito(): CarritoItem[] {
    return this._carrito.getValue();
  }

  vaciarCarrito(): void {
    this._carrito.next([]);
    this.actualizarCantidadProductos();
  }

  private getAuthHeaders(): HttpHeaders {
    const cliente = this.loginService.obtenerClienteLogueado();
    return new HttpHeaders({
      'Authorization': `Bearer ${cliente?.access}`
    });
  }

  getDireccionesEnvio(): Observable<string[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/direcciones/`, { headers }).pipe(
      map(response => response.map(item => `${item.calle}, ${item.ciudad}, ${item.provincia}`))
    );
  }

  setDireccionSeleccionada(direccion: string): void {
    this.direccionSeleccionada = direccion;
  }

  getDireccionSeleccionada(): string {
    return this.direccionSeleccionada;
  }

  async confirmarCompra(): Promise<void> {
    if (!this.direccionSeleccionada) {
      alert('Debes seleccionar una dirección de envío.');
      return;
    }

    const carrito = this.obtenerCarrito();
    if (carrito.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    const preferenceData = {
      items: carrito.map((item) => ({
        title: item.titulo,
        unit_price: Number(item.precio),
        quantity: item.cantidad,
      })),
      payer: {
        address: {
          street_name: this.direccionSeleccionada,
        }
      }
    };

    try {
      const response = await this.http
        .post<any>(
          'https://api.mercadopago.com/checkout/preferences?access_token=TEST-6771469815948587-060715-3d53e33eb7fe31e220ad7f572e68ae8f-1846522961',
          preferenceData
        )
        .toPromise();

      if (response && response.init_point) {
        window.location.href = response.init_point;
      } else {
        console.error('Error: No se recibió preferenceId');
      }
    } catch (error) {
      console.error('Error al crear preferencia de pago:', error);
      alert('Ocurrió un error al procesar el pago. Intenta nuevamente.');
    }
  }
}
