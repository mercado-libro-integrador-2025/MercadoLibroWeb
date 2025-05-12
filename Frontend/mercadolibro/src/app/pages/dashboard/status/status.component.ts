import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent {
  order = {
    orderId: 12345,
    fecha: "20/05/2024",
    status: 'En proceso'
  };
}
