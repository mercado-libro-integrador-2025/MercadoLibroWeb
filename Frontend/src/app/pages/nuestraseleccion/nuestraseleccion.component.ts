import { Component, OnInit } from '@angular/core';
import { ProductoComponent } from './producto/producto.component';
import { CarritoComponent } from './carrito/carrito.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nuestraseleccion',
  imports: [CommonModule, RouterModule, ProductoComponent, CarritoComponent],
  templateUrl: './nuestraseleccion.component.html',
  styleUrls: ['./nuestraseleccion.component.css'],
  standalone: true,
})

export class NuestraseleccionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }
}
