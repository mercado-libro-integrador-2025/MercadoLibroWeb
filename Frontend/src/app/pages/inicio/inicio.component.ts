import { CommonModule, NgIf } from '@angular/common';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router, ActivatedRoute } from '@angular/router';

declare var bootstrap: any;


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  loginFormulario: FormGroup;
  registroFormulario: FormGroup;
  registroExitoso: boolean = false;
  usuarioRegistrado: boolean = false;

  @ViewChild('registroModal') registroModalElementRef!: ElementRef;


  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
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
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
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
    }, {
      validators: this.matchingPasswordsValidator('password', 'repetirPassword')
    });
  }

  matchingPasswordsValidator(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordControl = control.get(passwordKey);
      const confirmPasswordControl = control.get(confirmPasswordKey);

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

       if (confirmPasswordControl.errors && Object.keys(confirmPasswordControl.errors).filter(key => key !== 'notMatching').length > 0) {
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

  ngOnInit(): void {
     const navigation = this.router.getCurrentNavigation();
     const state = navigation?.extras.state;

     if (state?.['openRegisterModal']) {
         console.log('Estado de navegación detectado: ¡Abrir modal de registro!');
         setTimeout(() => {
            this.openRegistroModal();
         }, 0);
     } else {
         console.log('Estado de navegación sin instrucción para abrir modal de registro.');
     }
  }

  openRegistroModal(): void {
      const modalElement = this.registroModalElementRef?.nativeElement;
      if (modalElement && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
           let modalInstance = bootstrap.Modal.getInstance(modalElement);
           if (!modalInstance) {
               modalInstance = new bootstrap.Modal(modalElement);
           }
           modalInstance.show();
           console.log('Modal de registro abierto programáticamente.');
      } else {
           console.warn('No se pudo encontrar el elemento del modal (#registroModal en HTML) o la biblioteca Bootstrap JavaScript no está cargada globalmente.');
      }
  }

  enviarDatosRegistro(event: Event) {
    event.preventDefault();

     this.matchingPasswordsValidator('password', 'repetirPassword')(this.registroFormulario);
     this.registroFormulario.get('repetirPassword')?.updateValueAndValidity();


    if (this.registroFormulario.valid) {
      const username = this.registroFormulario.value.username;
      const email = this.registroFormulario.value.email;
      const password = this.registroFormulario.value.password;

      this.loginService.registrarUsuario(username, email, password).subscribe(
        response => {
           console.log('Registro exitoso:', response);
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
                 console.warn('No se encontró la instancia del modal de Bootstrap para cerrar automáticamente.');
                 this.registroFormulario.reset();
              }
          } else {
               console.error('No se pudo cerrar el modal: elemento o Bootstrap no disponible.');
               this.registroFormulario.reset();
          }

        },
        error => {
          console.error('Error en el registro:', error);
          if (error.status === 400 && error.error?.email) {
             alert('El email ya está registrado.');
             this.usuarioRegistrado = true;
          } else if (error.status === 400 && error.error?.username) {
              alert('El nombre de usuario ya está en uso.');
              this.usuarioRegistrado = true;
          }
           else if (error.status === 400) {
             alert('Datos de registro inválidos. Verifica los campos.');
             this.usuarioRegistrado = true;
           }
           else {
              alert("Ocurrió un error al registrar. Inténtalo de nuevo.");
              this.usuarioRegistrado = false;
          }

          this.registroExitoso = false;

          setTimeout(() => {
             this.usuarioRegistrado = false;
           }, 5000);
        }
      );
    } else {
      this.registroFormulario.markAllAsTouched();
      console.warn('Formulario de registro inválido en el frontend. No se envió.');
       Object.keys(this.registroFormulario.controls).forEach(key => {
         const controlErrors = this.registroFormulario.get(key)?.errors;
         if (controlErrors != null) {
           console.log(`Control '${key}': Errores:`, controlErrors);
         }
       });
       if (this.registroFormulario.errors?.['notMatching']) {
           console.log('Error de coincidencia de contraseñas a nivel de formulario:', this.registroFormulario.errors['notMatching']);
       }
    }
  }

  onEnviar(event: Event) {
    event.preventDefault();
    if (this.loginFormulario.valid) {
      const email = this.loginFormulario.value.email;
      const password = this.loginFormulario.value.password;
      this.loginService.autenticarUsuario(email, password).subscribe(
        response => {
           console.log('Login exitoso:', response);
          this.router.navigate(['/dashboard/profile-dashboard']);
        },
        error => {
          console.error('Error en el login:', error);
           if (error.status === 400 || error.status === 401) {
                alert("Email o contraseña incorrectos.");
           } else {
                alert("Ocurrió un error al iniciar sesión. Inténtalo de nuevo.");
           }
        }
      );
    } else {
      this.loginFormulario.markAllAsTouched();
      console.warn('Formulario de login inválido en el frontend. No se envió.');
        Object.keys(this.loginFormulario.controls).forEach(key => {
           const controlErrors = this.loginFormulario.get(key)?.errors;
           if (controlErrors != null) {
              console.log(`Control '${key}': Errores:`, controlErrors);
           }
        });
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

  get EmailRegistro() {
    return this.registroFormulario.get('email');
  }

  get PasswordRegistro() {
    return this.registroFormulario.get('password');
  }

  get RepetirPassword() {
    return this.registroFormulario.get('repetirPassword');
  }

  get passwordsDoNotMatch() {
    return this.registroFormulario.getError('notMatching') &&
           (this.registroFormulario.get('password')?.touched || this.registroFormulario.get('repetirPassword')?.touched);
  }
}