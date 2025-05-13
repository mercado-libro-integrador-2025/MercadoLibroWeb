import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface CarritoItem {
  titulo: string;
  precio: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private _carrito = new BehaviorSubject<CarritoItem[]>([]);
  private _cantidadProductos = new BehaviorSubject<number>(0);
  carrito = this._carrito.asObservable();
  cantidadProductos = this._cantidadProductos.asObservable();

  private formaEnvioUrl = 'http://127.0.0.1:8000/api/formasenvio/';
  private formaPagoUrl = 'http://127.0.0.1:8000/api/formaspago/';
  private direccionUrl = 'http://127.0.0.1:8000/api/direcciones/';

  constructor(private http: HttpClient) { }

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
    this.actualizarCantidadProductos(carritoActual);
  }

  actualizarCantidadProductos(carrito: CarritoItem[]): void {
    const cantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    this._cantidadProductos.next(cantidad);
  }

  getFormaEnvio(): Observable<string[]> {
    return this.http.get<any[]>(this.formaEnvioUrl).pipe(
      map(response => response.map(item => item.forma_envio))
    );
  }

  getFormaPago(): Observable<string[]> {
    return this.http.get<any[]>(this.formaPagoUrl).pipe(
      map(response => response.map(item => item.forma_pago))
    );
  }

  getDireccionEnvio(): Observable<string[]> {
    return this.http.get<any[]>(this.direccionUrl).pipe(
      map(response => response.map(item => item.calle + ', ' + item.ciudad + ', ' + item.provincia))
    );
  }
}