import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [FormsModule] 
})
export class ProfileComponent implements OnInit {
  clienteLogueado: any;
  modoEdicion = false;

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    this.clienteLogueado  = this.loginService.obtenerClienteLogueado();
  }

  toggleEdicion(): void {
    this.modoEdicion = !this.modoEdicion;
  }
}
