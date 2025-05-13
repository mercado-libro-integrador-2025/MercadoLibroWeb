import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductoService } from "../../../services/producto.service";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  categorias: string[] = [];
  opcionSeleccionada: string = '';
  terminoBusqueda: string = '';

  @Output() buscar = new EventEmitter<{ termino: string, categoria: string }>();

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {
    this.getCategorias();
  }

  getCategorias(): void {
    this.productoService.getCategorias().subscribe(
      categorias => {
        this.categorias = categorias;
      },
      error => {
        console.error('Error al obtener las categorías', error);
      }
    );
  }

  buscarLibros(): void {
    this.buscar.emit({ termino: this.terminoBusqueda, categoria: this.opcionSeleccionada });
  }
}
