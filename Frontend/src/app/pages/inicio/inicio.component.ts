import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  loginFormulario: FormGroup;
  registroFormulario: FormGroup;
  registroExitoso: boolean = false; 
  usuarioRegistrado: boolean = false; 

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private router: Router) {
    // Formularios de login y registro
    this.loginFormulario = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/)
      ]]
    });

    this.registroFormulario = this.formBuilder.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/)

      ]],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/)
      ]],
      repetirPassword: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/)
      ]]
    }, { validators: this.matchingPasswordsValidator('password', 'repetirPassword') });
  }

  // Validador para coincidir las contraseñas
  matchingPasswordsValidator(password: string, confirmPassword: string) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const passwordControl = control.get(password);
      const confirmPasswordControl = control.get(confirmPassword);

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      const isMatching = passwordControl.value === confirmPasswordControl.value;
      return isMatching ? null : { notMatching: true };
    };
  }

  // Enviar datos de registro
  enviarDatosRegistro(event: Event) {
    event.preventDefault();
    if (this.registroFormulario.valid) {
      const username = this.registroFormulario.value.username;
      const email = this.registroFormulario.value.email;
      const password = this.registroFormulario.value.password;
      this.loginService.registrarUsuario(username, email, password).subscribe(
        response => {
          this.registroExitoso = true;
          this.usuarioRegistrado = false;
          setTimeout(() => {
            this.registroExitoso = false;
          }, 5000);
        },
        error => {
          this.usuarioRegistrado = true;
          this.registroExitoso = false;
          setTimeout(() => {
            this.usuarioRegistrado = false;
          }, 5000);
        }
      );
    } else {
      this.registroFormulario.markAllAsTouched();
    }
  }

  // Enviar datos de login
  onEnviar(event: Event) {
    event.preventDefault();
    if (this.loginFormulario.valid) {
      const email = this.loginFormulario.value.email;
      const password = this.loginFormulario.value.password;
      this.loginService.autenticarUsuario(email, password).subscribe(
        response => {
          sessionStorage.setItem('usuarioAutenticado', email);
          this.router.navigate(['/dashboard/profile-dashboard']);
        },
        error => {
          alert("Credenciales incorrectas");
        }
      );
    } else {
      this.loginFormulario.markAllAsTouched();
    }
  }

  // Getters para acceder a los controles
  get Email() {
    return this.loginFormulario.get('email');
  }

  get Password() {
    return this.loginFormulario.get('password');
  }

  get Username() {
    return this.registroFormulario.get('username');
  }

  get RepetirPassword() {
    return this.registroFormulario.get('repetirPassword');
  }
}
