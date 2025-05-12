import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

import { SidebarComponent } from './sidebar/sidebar.component';
import { StatusComponent } from './status/status.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { HistorialComprasComponent } from './historial-compras/historial-compras.component';
import { DatospersonalesComponent } from './datospersonales/datospersonales.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, DatospersonalesComponent, RouterLink, CommonModule, SidebarComponent, StatusComponent, ReviewsComponent, HistorialComprasComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor() { }
}

