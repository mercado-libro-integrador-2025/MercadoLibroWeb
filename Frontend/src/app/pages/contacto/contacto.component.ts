import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Contacto } from '../../services/models/contacto.models';
import { ContactoService } from '../../services/contacto.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, NgIf ],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {

  contactForm!: FormGroup;
  isLoading = false;
  submissionMessage: string | null = null;
  submissionError: string | null = null;

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

  get nombre() { return this.contactForm.get('nombre'); }
  get email() { return this.contactForm.get('email'); }
  get asunto() { return this.contactForm.get('asunto'); }
  get mensaje() { return this.contactForm.get('mensaje'); }

  onSubmit(): void {
    this.contactForm.markAllAsTouched();

    if (this.contactForm.valid) {
      this.isLoading = true;
      this.submissionMessage = null;
      this.submissionError = null;

      const data: Contacto = this.contactForm.value;

      this.contactoService.enviarContacto(data).subscribe({
        next: (_) => {
          this.isLoading = false;
          alert('¡Gracias por tu mensaje!  hemos recibido correctamente tu mensaje :).');
          this.contactForm.reset();
          this.contactForm.markAsUntouched();
          this.contactForm.markAsPristine();
        },
        error: (error) => {
          this.isLoading = false;
          alert('Hubo un error al enviar tu mensaje. Inténtalo nuevamente.');
          console.error('Error al enviar contacto:', error);
        }
      });
    }
  }
}
