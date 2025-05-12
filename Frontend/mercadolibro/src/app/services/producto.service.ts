import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Libro } from './models/producto';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://127.0.0.1:8000/api/libros/';
  private categoriaUrl = 'http://127.0.0.1:8000/api/categorias/';

  constructor(private http: HttpClient) { }

  // getLibros(): Observable<Libro[]> {
  //   return this.http.get<Libro[]>(this.apiUrl);
  // }

  getLibro(id_libro: number): Observable<Libro> {
    const url = `${this.apiUrl}${id_libro}/`;
    return this.http.get<Libro>(url);
  }

  searchLibros(termino: string, categoria: string): Observable<Libro[]> {
    let params = new HttpParams();

    if (termino) {
      params = params.set('titulo__icontains', termino);
    }

    if (categoria) {
      params = params.set('id_categoria__nombre_categoria', categoria);
    }

    return this.http.get<Libro[]>(this.apiUrl, { params });
  }

  getCategorias(): Observable<string[]> {
    return this.http.get<any[]>(this.categoriaUrl).pipe(
      map(response => response.map(item => item.nombre_categoria))
    );
  }
}