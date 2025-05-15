import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Contacto, ApiResponse } from '../../services/models/contacto.models';
import { ContactoService } from '../../services/contacto.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {

  contactForm!: FormGroup;
  isLoading = false;
  submissionMessage: string | null = null;
  submissionError: string | null = null;

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
    private contactoService: ContactoService
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      asunto: ['', [Validators.required, Validators.maxLength(150)]],
      mensaje: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
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

  onSubmit() {
    this.contactForm.markAllAsTouched();

    if (this.contactForm.valid) {
      this.isLoading = true;
      this.submissionMessage = null;
      this.submissionError = null;

      const data: Contacto = this.contactForm.value;

      this.contactoService.enviarContacto(data).subscribe({
        next: (response: ApiResponse) => {
          this.isLoading = false;
          if (response.success) {
            this.submissionMessage = response.message || '¡Gracias por tu mensaje! Lo hemos recibido correctamente.';
            this.contactForm.reset();
            this.contactForm.markAsUntouched();
            this.contactForm.markAsPristine();
          } else {
            this.submissionError = response.message || 'Hubo un problema al enviar tu mensaje.';
          }
        },
        error: error => {
          this.isLoading = false;
          this.submissionError = 'Hubo un error al enviar tu mensaje. Inténtalo de nuevo.';
          console.error('Error al enviar mensaje:', error);
        }
      });
    }
  }
}
