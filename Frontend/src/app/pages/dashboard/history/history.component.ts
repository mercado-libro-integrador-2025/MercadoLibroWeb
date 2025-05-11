import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-history',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
    detallesPedidos: any[] = [];

    constructor(
        private loginService: LoginService
    ) { }

    ngOnInit(): void {

    }
}
