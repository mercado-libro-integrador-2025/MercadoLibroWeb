
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from './login.service';
import { Direccion } from './models/direccion'; 

declare const MercadoPago: any;

export interface CarritoItem {
  id_libro: number; // agrego el id de libro
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

  //  almaceno el ID de la dirección seleccionada (numérico o null)
  private direccionSeleccionadaSubject = new BehaviorSubject<number | null>(null);
  // uso Observable para que otros componentes se suscriban a los cambios de la dirección
  direccionSeleccionada$ = this.direccionSeleccionadaSubject.asObservable();

  private mercadoPagoPublicKey = 'TEST-826ea554-1909-4e44-8169-70fa973537ba';

  constructor(private http: HttpClient, private loginService: LoginService) { }

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

  aumentarCantidad(titulo: string): void {
    const carritoActual = this._carrito.getValue();
    const item = carritoActual.find(ci => ci.titulo === titulo);
    if (item) {
      item.cantidad++;
      this._carrito.next(carritoActual);
      this.actualizarCantidadProductos();
    }
  }

  disminuirCantidad(titulo: string): void {
    const carritoActual = this._carrito.getValue();
    const index = carritoActual.findIndex(ci => ci.titulo === titulo);

    if (index > -1) {
      carritoActual[index].cantidad--;
      if (carritoActual[index].cantidad === 0) {
        carritoActual.splice(index, 1);
      }
      this._carrito.next(carritoActual);
      this.actualizarCantidadProductos();
    }
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

    this.setDireccionSeleccionada(null);
  }

  private getAuthHeaders(): HttpHeaders {
    const cliente = this.loginService.obtenerClienteLogueado();
    return new HttpHeaders({
      'Authorization': `Bearer ${cliente?.access}`
    });
  }

  // devuelvo un  Observable de array de objetosde  Direccion
  getDireccionesEnvio(): Observable<Direccion[]> {
    const headers = this.getAuthHeaders();

    return this.http.get<Direccion[]>(`${this.apiUrl}/direcciones/`, { headers });
  }


  setDireccionSeleccionada(direccionId: number | null): void {
    this.direccionSeleccionadaSubject.next(direccionId);
  }


  getDireccionSeleccionada(): number | null {
    return this.direccionSeleccionadaSubject.getValue();
  }

  async confirmarCompra() {
    try {
      const headers = this.getAuthHeaders();
      // mapeo id libro
      const productos = this.obtenerCarrito().map(item => ({
        id_libro: item.id_libro, 
        cantidad: item.cantidad,
        titulo: item.titulo,
        precio: item.precio
      }));

      if (productos.length === 0) {
        alert('El carrito está vacío. Agrega productos para continuar.');
        return;
      }

      // obtengo id y verifico q no sea null
      const direccionId = this.getDireccionSeleccionada();
      if (direccionId === null) { 
        alert('Por favor, selecciona una dirección de envío para continuar.');
        return;
      }

      const preference = await lastValueFrom(
        this.http.post<any>(
          `${this.apiUrl}/checkout/crear-preferencia/`,
          {
            productos: productos,
            direccion_id: direccionId, 
            is_mobile_app: false // web
          },
          { headers }
        )
      );
      const preferenceId = preference.id;

      if (typeof MercadoPago === 'undefined') {
        throw new Error('El SDK de MercadoPago no está cargado.');
      }

      const mp = new MercadoPago(this.mercadoPagoPublicKey, {
        locale: 'es-AR'
      });

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