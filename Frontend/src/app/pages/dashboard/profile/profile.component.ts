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

  datosPersonalesForm: any = {
    username: '',
    email: '',
    password: ''
  };

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
    this.datosPersonalesForm.username = this.clienteLogueado.user.username;
    this.datosPersonalesForm.email = this.clienteLogueado.user.email;
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
<<<<<<< HEAD
}
=======

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

actualizarDatosPersonales(): void {
    const { username, email, password } = this.datosPersonalesForm;
    if (!password) {
      alert('Debes ingresar tu contraseña actual para confirmar los cambios.');
      return;
    }

    this.loginService.actualizarDatosPersonales(username, email, password).subscribe({
      next: () => {
        alert('Datos actualizados correctamente.');
        this.clienteLogueado.user.username = username;
        this.clienteLogueado.user.email = email;
        localStorage.setItem('clienteLogueado', JSON.stringify(this.clienteLogueado));
      },
      error: (err) => {
        console.error('Error al actualizar datos personales:', err);
        alert('Hubo un problema al actualizar los datos. Verifica tu contraseña.');
      }
    });
  }
}
>>>>>>> c7a6bd7c471230c40495d840e21ffedf041411ff
