import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CarritoService } from '../../../services/carrito.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';


interface CarritoItem {
  titulo: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-resumen-compra',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, NgFor],
  standalone: true,
  templateUrl: './finalizar-compra.component.html',
  styleUrl: './finalizar-compra.component.css'

})
export class ResumenCompraComponent implements OnInit {
  carrito: CarritoItem[] = [];
  total: number = 0;

  formasPago: string[] = [];
  formasEnvio: string[] = [];
  direccionesEnvio: string[] = [];

  formaEnvioSeleccionada: string = '';
  formaPagoSeleccionada: string = '';
  direccionSeleccionada: string = '';

  preferenceId: string | undefined;

  constructor(
    private carritoService: CarritoService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCarrito();
    this.getFormaPago();
    this.getFormaEnvio();
    this.getDireccionEnvio();
  }

  getCarrito(): void {
    this.carritoService.carrito.subscribe((carrito) => {
      this.carrito = carrito;
      this.calcularTotal();
    });
  }

  calcularTotal(): void {
    this.total = this.carrito.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );
  }

  getFormaPago(): void {
    this.carritoService.getFormaPago().subscribe(
      (formasPago) => {
        this.formasPago = formasPago;
      },
      (error) => {
        console.error('Error al obtener las formas de pago', error);
      }
    );
  }

  getFormaEnvio(): void {
    this.carritoService.getFormaEnvio().subscribe(
      (formasEnvio) => {
        this.formasEnvio = formasEnvio;
      },
      (error) => {
        console.error('Error al obtener las formas de envío', error);
      }
    );
  }

  getDireccionEnvio(): void {
    this.carritoService.getDireccionEnvio().subscribe(
      (direccionesEnvio) => {
        this.direccionesEnvio = direccionesEnvio;
      },
      (error) => {
        console.error('Error al obtener las direcciones', error);
      }
    );
  }

  createPreferenceAndRedirect(): void {
    const preferenceData = {
      items: this.carrito.map((item) => ({
        title: item.titulo,
        unit_price: item.precio, // Asegurar que el precio es un número
        quantity: item.cantidad,
      })),
    };
    console.log('Tipo de dato de item.precio:', typeof this.carrito[0].precio); // ver tipo datos
    console.log('Tipo de dato de item.titulo:', typeof this.carrito[0].titulo); // 
    console.log('Tipo de dato de item.cantidad:', typeof this.carrito[0].cantidad); // 

    this.http
      .post<any>(
        'https://api.mercadopago.com/checkout/preferences?access_token=TEST-6771469815948587-060715-3d53e33eb7fe31e220ad7f572e68ae8f-1846522961',
        preferenceData
      )
      .subscribe(
        (response) => {
          this.preferenceId = response.id;
          this.redirectToSandbox(this.preferenceId);
        },
        (error) => {
          console.error('Error creating preference:', error);


          if (error.error && error.error.message === 'Una de las partes con la que intentás hacer el pago es de prueba.') {
            this.router.navigate(['/nuestraseleccion']);
          } else {
            this.router.navigate(['/dashboard/resumenCompra']);
          }
        }
      );
  }

  redirectToSandbox(preferenceId: string | undefined): void {
    if (preferenceId) {
      window.location.href = `https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;
    } else {
      console.error('No se pudo redirigir porque preferenceId no está definido.');
    }
  }
}