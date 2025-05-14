import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Importa tu servicio para enviar el mensaje si lo tienes implementado
// import { ContactoService } from '../../services/contacto.service';
// import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIf,
    // HttpClientModule
  ],
  templateUrl: './contacto.component.html', // Asegúrate de que esta ruta sea correcta
  styleUrls: ['./contacto.component.css'] // Asegúrate de que esta ruta sea correcta
})
export class ContactoComponent implements OnInit {

  contactForm!: FormGroup;

  isLoading = false;
  submissionMessage: string | null = null;
  submissionError: string | null = null;

  // Ejemplo de datos de contacto si los usas en tu HTML (como en tu original)
   datosContacto = [
     { tipo: 'telefono', telefono: '+54 9 351 XXXXXX' },
     { tipo: 'ubicacion', ubicacion: 'Calle Falsa 123, Córdoba, Argentina' },
     { tipo: 'facebook', facebook: 'https://www.facebook.com/MercadoLibro' },
     { tipo: 'instagram', instagram: 'https://www.instagram.com/MercadoLibro' },
     { tipo: 'twitter', twitter: 'https://twitter.com/MercadoLibro' },
     { tipo: 'linkedin', linkedin: 'https://www.linkedin.com/company/MercadoLibro' }
   ];


  constructor(
    private fb: FormBuilder,
    // private contactoService: ContactoService
    ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
       asunto: ['', [
         Validators.required,
         Validators.maxLength(150)
       ]],
      mensaje: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]]
    });

     this.contactForm.valueChanges.subscribe(() => {
         this.submissionMessage = null;
         this.submissionError = null;
     });
  }

  get nombre() {
    return this.contactForm.get('nombre');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get asunto() {
    return this.contactForm.get('asunto');
  }

  get mensaje() {
    return this.contactForm.get('mensaje');
  }

   get datosContactoArray() {
     return this.datosContacto;
   }

   get isSending() {
       return this.isLoading;
   }


  onSubmit() {
    this.contactForm.markAllAsTouched();

    if (this.contactForm.valid) {
      this.isLoading = true;
      this.submissionMessage = null;
      this.submissionError = null;

      console.log('Formulario válido. Datos a enviar:', this.contactForm.value);

      // --- EJEMPLO DE LLAMADA A SERVICIO ---
      /*
      this.contactoService.enviarMensaje(this.contactForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.submissionMessage = '¡Gracias por tu mensaje! Lo hemos recibido correctamente.';
          this.contactForm.reset();
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

      // --- EJEMPLO DE SIMULACIÓN ---
       setTimeout(() => {
         this.isLoading = false;
         this.submissionMessage = '¡Mensaje enviado! (Simulado)';
         console.log('Envío simulado exitoso.');
         this.contactForm.reset();
         this.contactForm.markAsUntouched();
         this.contactForm.markAsPristine();
       }, 2000);


    } else {
      console.warn('Formulario inválido. No se envió.');
    }
  }
}