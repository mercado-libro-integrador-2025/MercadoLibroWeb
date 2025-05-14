import { Component, OnInit } from '@angular/core'; // Importa OnInit si lo necesitas
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importa solo lo necesario
import { CommonModule, NgIf } from '@angular/common'; // Importa CommonModule y NgIf
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule
// Asume que tienes un servicio para enviar el contacto (ej: ContactoService)
// import { ContactoService } from '../../services/contacto.service';
// import { HttpClientModule } from '@angular/common/http'; // Si ContactoService usa HttpClient


@Component({
  selector: 'app-contacto', // Asegúrate de que el selector coincida con donde usas este componente
  standalone: true,
  // Importa los módulos necesarios
  imports: [CommonModule, ReactiveFormsModule, NgIf /*, HttpClientModule si el servicio va aquí */ ],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'] // Asegúrate de que esta ruta sea correcta
})
export class ContactoComponent implements OnInit { // Implementa OnInit si necesitas lógica al iniciar

  contactForm!: FormGroup; // Define el FormGroup
  isLoading = false; // Bandera para mostrar el spinner en el botón
  submissionMessage: string | null = null; // Mensaje de éxito del envío
  submissionError: string | null = null; // Mensaje de error del envío

  // Si necesitas mostrar datos de contacto fijos, los puedes definir aquí o traerlos de un servicio
   datosContacto = [
     { tipo: 'telefono', telefono: '+54 9 351 XXXXXX' }, // Reemplaza XXXXXX
     { tipo: 'ubicacion', ubicacion: 'Calle Falsa 123, Córdoba, Argentina' },
     { tipo: 'facebook', facebook: 'https://www.facebook.com/MercadoLibro' }, // Reemplaza
     { tipo: 'instagram', instagram: 'https://www.instagram.com/MercadoLibro' }, // Reemplaza
     { tipo: 'twitter', twitter: 'https://twitter.com/MercadoLibro' }, // Reemplaza
     { tipo: 'linkedin', linkedin: 'https://www.linkedin.com/company/MercadoLibro' } // Reemplaza
   ];


  constructor(
    private fb: FormBuilder, // Inyecta FormBuilder para crear el formulario
    // private contactoService: ContactoService // Inyecta tu servicio de contacto
    ) {}

  ngOnInit(): void {
    // Inicializa el formulario en ngOnInit
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]], // Validators.email ya verifica el formato básico
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
      // Eliminados improvementDescription y isNotRobot
    });

     // Opcional: Limpiar mensajes después de unos segundos
     this.contactForm.valueChanges.subscribe(() => {
         this.submissionMessage = null;
         this.submissionError = null;
     });
  }

  // Getters para acceder fácilmente a los controles del formulario en la plantilla
  get name() {
    return this.contactForm.get('name');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get message() {
    return this.contactForm.get('message');
  }

  // Método que se ejecuta al enviar el formulario
  onSubmit() {
    // Marca todos los controles como 'touched' para mostrar los errores de validación si los hay
    this.contactForm.markAllAsTouched();

    // Verifica si el formulario es válido
    if (this.contactForm.valid) {
      this.isLoading = true; // Activa el spinner
      this.submissionMessage = null; // Limpia mensajes anteriores
      this.submissionError = null;

      // ** Aquí es donde llamarías a tu servicio para enviar los datos **
      console.log('Formulario válido. Datos a enviar:', this.contactForm.value);

      // Ejemplo de llamada a un servicio (descomenta e implementa tu ContactoService)
      /*
      this.contactoService.enviarMensaje(this.contactForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.submissionMessage = '¡Gracias por tu mensaje! Lo hemos recibido.';
          this.contactForm.reset(); // Limpia el formulario después del envío exitoso
          // Opcional: Marcar controles como 'untouched' o 'pristine' después del reset si usas esas validaciones
          this.contactForm.markAsUntouched();
          this.contactForm.markAsPristine();
        },
        error: (error) => {
          this.isLoading = false;
          this.submissionError = 'Hubo un error al enviar tu mensaje. Inténtalo de nuevo.';
          console.error('Error al enviar mensaje:', error);
        }
      });
      */

      // Si no tienes un servicio implementado aún, puedes simular un envío exitoso:
       setTimeout(() => {
         this.isLoading = false;
         this.submissionMessage = '¡Mensaje enviado! (Simulado)';
         console.log('Envío simulado exitoso.');
         this.contactForm.reset();
         this.contactForm.markAsUntouched();
         this.contactForm.markAsPristine();
       }, 2000); // Simula un retraso de 2 segundos


    } else {
      // Si el formulario no es válido, simplemente los mensajes de validación se mostrarán
      console.warn('Formulario inválido. No se envió.');
    }
  }

  // Si necesitas mantener el getter para datosContacto para mostrar la lista en el HTML
   get datosContactoArray() {
     return this.datosContacto;
   }

   // Si quieres mantener el getter para el estado isLoading (ya se usa en el botón)
   get isSending() {
       return this.isLoading;
   }
}