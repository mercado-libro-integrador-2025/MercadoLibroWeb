import { CommonModule, NgIf } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';

declare var bootstrap: any;


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

  @ViewChild('registroModal') registroModalElementRef!: ElementRef;


  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private router: Router) {
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

  matchingPasswordsValidator(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordControl = control.get(passwordKey);
      const confirmPasswordControl = control.get(confirmPasswordKey);

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['notMatching']) {
          return null;
      }

      const isMatching = passwordControl.value === confirmPasswordControl.value;

      if (!isMatching) {
          confirmPasswordControl.setErrors({ ...confirmPasswordControl.errors, notMatching: true });
      } else {
          const errors = confirmPasswordControl.errors;
          if (errors && errors['notMatching']) {
             delete errors['notMatching'];
             if (Object.keys(errors).length === 0) {
                 confirmPasswordControl.setErrors(null);
             } else {
                  confirmPasswordControl.setErrors(errors);
             }
          }
      }

      return null;
    };
  }


  enviarDatosRegistro(event: Event) {
    event.preventDefault();

    this.matchingPasswordsValidator('password', 'repetirPassword')(this.registroFormulario);

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
          }, 4000);

          const modalElement = this.registroModalElementRef?.nativeElement;
          if (modalElement && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
              const modalInstance = bootstrap.Modal.getInstance(modalElement);
              if (modalInstance) {
                  setTimeout(() => {
                    modalInstance.hide();
                    console.log('Modal de registro cerrado tras delay.');
                    this.registroFormulario.reset();
                  }, 3000);
              } else {
                 console.warn('No se encontró el del modal de Bootstrap. No se pudo cerrar automáticamente.');
                 this.registroFormulario.reset();
              }
          } else {
              console.error('No se pudo cerrar el modal.');
              this.registroFormulario.reset();
          }

        },
        error => {
          this.usuarioRegistrado = true;
          this.registroExitoso = false;
          setTimeout(() => {
            this.usuarioRegistrado = false;
          }, 5000);
          console.error('Error en el registro:', error);
        }
      );
    } else {
      this.registroFormulario.markAllAsTouched();
      console.warn('Formulario de registro inválido. No se envió.');
      Object.keys(this.registroFormulario.controls).forEach(key => {
        const controlErrors = this.registroFormulario.get(key)?.errors;
        if (controlErrors != null) {
          console.log('Control: ' + key + ', Errores:', controlErrors);
        }
      });
    }
  }

  onEnviar(event: Event) {
    event.preventDefault();
    if (this.loginFormulario.valid) {
      const email = this.loginFormulario.value.email;
      const password = this.loginFormulario.value.password;
      this.loginService.autenticarUsuario(email, password).subscribe(
        response => {
          this.router.navigate(['/dashboard/profile-dashboard']);
        },
        error => {
          console.error('Error en el login:', error);
          alert("Credenciales incorrectas");
        }
      );
    } else {
      this.loginFormulario.markAllAsTouched();
      console.warn('Formulario de login inválido. No se envió.');
    }
  }

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