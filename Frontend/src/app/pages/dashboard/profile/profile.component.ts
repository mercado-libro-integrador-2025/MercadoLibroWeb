import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})

export class ProfileComponent implements OnInit {
  clienteLogueado: any;
  direcciones: any[] = [];
  direccionForm: any = {
    calle: '',
    numero: '',
    ciudad: '',
    provincia: ''
  };
  editandoId: number | null = null;

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    this.clienteLogueado = this.loginService.obtenerClienteLogueado();
    this.obtenerDireccionesCliente();
  }

  obtenerDireccionesCliente(): void {
    this.loginService.obtenerDirecciones().subscribe({
      next: (data) => this.direcciones = data,
      error: (error) => console.error('Error al obtener direcciones:', error)
    });
  }

  guardarDireccion(): void {
    if (this.editandoId) {
      this.loginService.editarDireccion(this.editandoId, this.direccionForm).subscribe({
        next: () => {
          this.resetFormulario();
          this.obtenerDireccionesCliente();
        },
        error: (err) => console.error('Error al editar dirección:', err)
      });
    } else {
      this.loginService.crearDireccion(this.direccionForm).subscribe({
        next: () => {
          this.resetFormulario();
          this.obtenerDireccionesCliente();
        },
        error: (err) => console.error('Error al crear dirección:', err)
      });
    }
  }

  cargarDireccion(direccion: any): void {
    this.direccionForm = { ...direccion };
    this.editandoId = direccion.id;
  }

  borrarDireccion(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta dirección?')) {
      this.loginService.eliminarDireccion(id).subscribe({
        next: () => this.obtenerDireccionesCliente(),
        error: (err) => console.error('Error al eliminar dirección:', err)
      });
    }
  }

  resetFormulario(): void {
    this.direccionForm = {
      calle: '',
      numero: '',
      ciudad: '',
      provincia: ''
    };
    this.editandoId = null;
  }

  eliminarCuenta(): void {
  if (confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
    this.loginService.eliminarCuenta().subscribe({
      next: () => {
        alert('Tu cuenta ha sido eliminada. ¡Esperamos verte pronto!');
        this.loginService.logout();
        window.location.href = '/'; // Redirige al usuario a la página de inicio
      },
      error: (err) => console.error('Error al eliminar la cuenta:', err)
    });
  }
}

}