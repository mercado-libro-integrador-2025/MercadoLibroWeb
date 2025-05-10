import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-delivery-status',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './delivery-status.component.html',
  styleUrls: ['./delivery-status.component.css']
})
export class DeliveryStatus {
  order = {
    orderId: 12345,
    fecha: "20/05/2024",
    status: 'En proceso'
  };
}
