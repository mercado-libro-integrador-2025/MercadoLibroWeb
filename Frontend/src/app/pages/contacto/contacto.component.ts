import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule si es standalone

import { ContactoService, Contacto } from '../../services/contacto.service';


@Component({
  selector: 'app-contacto', // Selector de tu componente
  standalone: true, // Indica que es un componente standalone
  imports: [
    CommonModule,
    ReactiveFormsModule, // Importa el módulo para formularios reactivos
    NgIf, // Aunque uses @if, es buena práctica importar NgIf
    HttpClientModule // <-- Importa HttpClientModule aquí si este componente es standalone
                     // Si usas módulos (app.module.ts), impórtalo allí en @NgModule.imports
  ],
  templateUrl: './contacto.component.html', // Ruta a tu archivo HTML
  styleUrls: ['./contacto.component.css'] // Ruta a tu archivo CSS
})
export class ContactoComponent implements OnInit { // Implementa OnInit

  contactForm!: FormGroup; // Declara el formulario reactivo

  isLoading = false; // Bandera para controlar el estado de carga (spinner/botón)
  submissionMessage: string | null = null; // Para mostrar mensaje de éxito
  submissionError: string | null = null; // Para mostrar mensaje de error

  // Mantén esto si lo usas en otra parte de tu HTML de contacto (fuera del formulario)
  // Si no lo usas en el HTML, puedes eliminar esta propiedad y el getter datosContactoArray
  datosContacto = [
     { tipo: 'telefono', telefono: '+54 9 351 XXXXXX' }, // Reemplaza XXXXXX
     { tipo: 'ubicacion', ubicacion: 'Calle Falsa 123, Córdoba, Argentina' },
     { tipo: 'facebook', facebook: 'https://www.facebook.com/MercadoLibro' }, // Reemplaza
     { tipo: 'instagram', instagram: 'https://www.instagram.com/MercadoLibro' }, // Reemplaza
     { tipo: 'twitter', twitter: 'https://twitter.com/MercadoLibro' }, // Reemplaza
     { tipo: 'linkedin', linkedin: 'https://www.linkedin.com/company/MercadoLibro' } // Reemplaza
  ];


  constructor(
    private fb: FormBuilder, // Inyecta FormBuilder para construir el formulario
    private contactoService: ContactoService // <--- ¡Inyecta el servicio ContactoService!
  ) {}

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    // Inicializa el formulario reactivo con los controles y validaciones
    this.contactForm = this.fb.group({
      // Los nombres de los controles deben coincidir EXACTAMENTE con los formControlName en tu HTML
      // y con los campos que tu API espera (nombre, email, asunto, mensaje)
      nombre: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100) // Asegúrate que este maxLength coincida con tu backend/HTML
      ]],
      email: ['', [
        Validators.required,
        Validators.email // Valida formato básico de email
      ]],
       asunto: ['', [
         Validators.required,
         Validators.maxLength(150) // Asegúrate que este maxLength coincida con tu backend/HTML
       ]],
      mensaje: ['', [
        Validators.required,
        Validators.minLength(10), // Asegúrate que este minLength coincida con tu backend/HTML
        Validators.maxLength(1000) // Asegúrate que este maxLength coincida con tu backend/HTML
      ]]
    });

     // Suscripción opcional para limpiar mensajes de envío/error si el usuario cambia el formulario
     this.contactForm.valueChanges.subscribe(() => {
         this.submissionMessage = null;
         this.submissionError = null;
     });
  }

  // Getters para acceder fácilmente a los controles del formulario desde la plantilla HTML
  get nombre() { return this.contactForm.get('nombre'); }
  get email() { return this.contactForm.get('email'); }
  get asunto() { return this.contactForm.get('asunto'); }
  get mensaje() { return this.contactForm.get('mensaje'); }

  // Getter para los datos de contacto (si los usas en el HTML)
   get datosContactoArray() { return this.datosContacto; }

  // Getter para el estado de carga, usado en el botón [disabled] y @if para el spinner
   get isSending() { return this.isLoading; }


  // Método que se ejecuta cuando se envía el formulario (si es válido)
  onSubmit() {
    // Marca todos los controles como 'touched' para activar la visualización de los mensajes de validación
    this.contactForm.markAllAsTouched();

    // Verifica si el formulario es válido antes de intentar enviar
    if (this.contactForm.valid) {
      this.isLoading = true; // Activa el estado de carga para mostrar el spinner
      this.submissionMessage = null; // Limpia mensajes anteriores
      this.submissionError = null;

      // Obtiene los datos del formulario. La estructura coincide con la interfaz Contacto.
      const contactData: Contacto = this.contactForm.value;

      // *** ¡Llama al servicio ContactoService para enviar los datos a tu API! ***
      this.contactoService.enviarContacto(contactData).subscribe({
        next: (response) => {
          // Esto se ejecuta si la petición POST fue exitosa (HTTP 2xx)
          this.isLoading = false; // Desactiva el estado de carga
          this.submissionMessage = '¡Gracias por tu mensaje! Lo hemos recibido correctamente.'; // Muestra mensaje de éxito
          console.log('Mensaje enviado con éxito:', response); // Log de la respuesta (opcional)

          // Limpia el formulario después del envío exitoso
          this.contactForm.reset();
          // Restablece el estado de touched/pristine para ocultar los mensajes de validación
          // Recorre los controles para asegurar que todos se limpien, incluyendo sus estados de validación
          Object.keys(this.contactForm.controls).forEach(key => {
             this.contactForm.controls[key].setErrors(null); // Limpia errores explícitamente
             this.contactForm.controls[key].markAsUntouched();
             this.contactForm.controls[key].markAsPristine();
          });
           // También restablece el estado del FormGroup completo
           this.contactForm.markAsUntouched();
           this.contactForm.markAsPristine();


          // Opcional: Limpiar el mensaje de éxito después de unos segundos
           setTimeout(() => {
             this.submissionMessage = null;
           }, 5000); // Mensaje visible por 5 segundos
        },
        error: (error) => {
          // Esto se ejecuta si la petición POST falló (HTTP 4xx, 5xx, etc.)
          this.isLoading = false; // Desactiva el estado de carga
          this.submissionError = 'Hubo un error al enviar tu mensaje. Inténtalo de nuevo.'; // Muestra mensaje de error genérico
          console.error('Error al enviar mensaje:', error); // Log del error (importante para depurar)

          // *** Manejo de errores específicos de la API de Django (opcional) ***
          // Tu API de Django REST Framework puede devolver errores de validación en un formato específico.
          // Por ejemplo, si un campo es inválido, podría devolver 400 Bad Request con un cuerpo JSON
          // como { "email": ["Enter a valid email address."] } o { "non_field_errors": ["Some error"] }
          // Puedes intentar mostrar esos errores específicos al usuario si tu API los proporciona.
          if (error.status === 400) { // Código común para errores de validación de DRF
              if (error.error && typeof error.error === 'object') {
                  let errorMessages = '';
                  for (const field in error.error) {
                      if (Array.isArray(error.error[field])) {
                          errorMessages += `${field}: ${error.error[field].join(', ')}\n`;
                      } else {
                           errorMessages += `${field}: ${error.error[field]}\n`;
                      }
                  }
                   this.submissionError = `Error de validación:\n${errorMessages}`;
                   console.error('Errores de validación del backend:', error.error);
              } else {
                  this.submissionError = 'Datos inválidos. Por favor, revisa el formulario.';
              }
          } else if (error.status >= 500) {
              this.submissionError = 'Error interno del servidor. Inténtalo más tarde.';
          }
          // Si no es 400 o 500+, se mantiene el mensaje genérico 'Hubo un error...'


           // Opcional: Limpiar el mensaje de error después de unos segundos
           setTimeout(() => {
             this.submissionError = null;
           }, 5000); // Mensaje visible por 5 segundos
        }
      });

    } else {
      // Si el formulario no es válido (las validaciones de Angular fallan en el frontend)
      // Los mensajes de error ya se muestran en el HTML gracias a [class.is-invalid] y @if
      console.warn('Formulario inválido. No se envió.');
      // Opcional: Puedes loggear errores específicos de validación del frontend para depuración si quieres
      /*
      Object.keys(this.contactForm.controls).forEach(key => {
        const controlErrors = this.contactForm.get(key)?.errors;
        if (controlErrors != null) {
          console.log(`Control '${key}': Errores:`, controlErrors);
        }
      });
      */
    }
  }
}
