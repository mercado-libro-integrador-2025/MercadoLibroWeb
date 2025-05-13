import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboardlanding',
  standalone: true,
  imports: [NgIf],
  templateUrl: './dashboardlanding.component.html',
  styleUrls: ['./dashboardlanding.component.css']
})
export class DashboardlandingComponent implements OnInit {
  clienteLogueado: any;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    this.clienteLogueado = this.loginService.obtenerClienteLogueado();
  }
}