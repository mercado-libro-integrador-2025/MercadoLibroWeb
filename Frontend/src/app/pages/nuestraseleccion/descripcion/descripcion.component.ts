import { Location, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Libro } from "../../../services/models/producto"
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../../services/producto.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-descripcion',
    standalone: true,
    imports: [NgIf, NgSwitch, NgSwitchCase],
    templateUrl: './descripcion.component.html',
    styleUrls: ['./descripcion.component.css']
})
export class DescripcionComponent {

    @Input() libro?: Libro;

    constructor(
        private route: ActivatedRoute,
        private productoService: ProductoService,
        private location: Location) { }

    ngOnInit(): void {
        this.getLibro();
    }

    getLibro(): void {
        const id = this.route.snapshot.paramMap.get('id');
        console.log(`ID from route: ${id}`); // Log para verificar el ID
        if (id) {
            const libroId = Number(id);
            if (!isNaN(libroId)) {
                this.productoService.getLibro(libroId)
                    .subscribe(
                        (libro: Libro) => this.libro = libro,
                        (error: HttpErrorResponse) => console.error(error)
                    );
            } else {
                console.error('Invalid ID');
            }
        } else {
            console.error('ID not found in route');
        }
    }


    goBack(): void {
        this.location.back();
    }
}