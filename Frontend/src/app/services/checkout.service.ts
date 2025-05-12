import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from './login.service';
import { lastValueFrom } from 'rxjs';

// Declarar MercadoPago para que TypeScript no genere errores
declare const MercadoPago: any;

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

  // URL de la API de tu backend (sin usar environment)
  private apiUrl = 'https://mercadolibroweb.onrender.com/api';
  private direccionSeleccionada: string = '';

  // Clave pública de MercadoPago (Sandbox)
  private mercadoPagoPublicKey = 'TEST-826ea554-1909-4e44-8169-70fa973537ba';

  constructor(private http: HttpClient, private loginService: LoginService) {}

  // Gestión del carrito
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

  // Gestión de autenticación
  private getAuthHeaders(): HttpHeaders {
    const cliente = this.loginService.obtenerClienteLogueado();
    return new HttpHeaders({
      'Authorization': `Bearer ${cliente?.access}`
    });
  }

  // Gestión de direcciones
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

  // Confirmar compra y redirigir a MercadoPago
  async confirmarCompra() {
    try {
      // Paso 1: Solicitar preferencia al backend
      const headers = this.getAuthHeaders();
      const preference = await lastValueFrom(
        this.http.post<any>(`${this.apiUrl}/checkout/crear-preferencia/`, {}, { headers })
      );
      const preferenceId = preference.id;

      // Paso 2: Verificar que el SDK esté cargado
      if (typeof MercadoPago === 'undefined') {
        throw new Error('El SDK de MercadoPago no está cargado.');
      }

      // Paso 3: Inicializar MercadoPago
      const mp = new MercadoPago(this.mercadoPagoPublicKey, {
        locale: 'es-AR'
      });

      // Paso 4: Redirigir al usuario al Checkout
      mp.checkout({
        preference: {
          id: preferenceId
        },
        autoOpen: true, 
      });
    } catch (error) {
      console.error('Error al iniciar el proceso de pago:', error);
      alert('Hubo un problema al iniciar el pago. Por favor, inténtalo de nuevo.');
    }
  }
}
