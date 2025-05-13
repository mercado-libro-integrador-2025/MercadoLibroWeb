import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Required for *ngIf, *ngFor, etc.

import type { ContactFormData } from '../../services/models/contacto.models';
import { ContactoService } from '../../services/contacto.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})

export class ContactoComponent implements OnInit {

  datosContacto: any;
  contactForm!: FormGroup;
  isLoading = false;
  isImproving = false;
   captchaToken: string | null = null;
  submissionMessage: string | null = null;
  submissionError: string | null = null;

  constructor(private formBuilder: FormBuilder, private contactoService: ContactoService) {

    this.datosContacto = contactoService.getDatosContacto();

  }

  private fb = inject(FormBuilder);
  private contactService = inject(ContactoService);
  // private toastService = inject(ToastService); // If you have a toast service

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      improvementDescription: ['', [Validators.maxLength(500)]],
      isNotRobot: [false, Validators.requiredTrue],
    });
    this.loadRecaptcha();

  }

   loadRecaptcha() {
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute('YOUR_RECAPTCHA_SITE_KEY', { action: 'submit' }).then((token: string) => {
        this.captchaToken = token;
      });
    });
  }

  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get message() { return this.contactForm.get('message'); }
  get improvementDescription() { return this.contactForm.get('improvementDescription'); }
  get isNotRobot() { return this.contactForm.get('isNotRobot'); }


  handleImproveMessage(): void {
    if (!this.message?.value || !this.improvementDescription?.value) {
      // this.toastService.error('Please enter a message and a description for improvement.');
      alert('Please enter a message and a description for improvement.');
      return;
    }

    this.isImproving = true;
    this.submissionMessage = null;
    this.submissionError = null;

    this.contactService.improveMessage({
      originalMessage: this.message.value,
      improvementDescription: this.improvementDescription.value,
    }).subscribe({
      next: (response) => {
        this.contactForm.patchValue({ message: response.improvedMessage });
        // this.toastService.success('Message Improved!', 'Your message has been updated with AI suggestions.');
        alert('Message Improved! Your message has been updated with AI suggestions.');
        this.isImproving = false;
      },
      error: (err) => {
        console.error('Error improving message:', err);
        // this.toastService.error('Error Improving Message', err.message || 'Could not improve the message.');
        alert(`Error Improving Message: ${err.message || 'Could not improve the message.'}`);
        this.isImproving = false;
      },
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched(); // Mark all fields as touched to display errors
      // this.toastService.error('Please correct the errors in the form.');
      alert('Please correct the errors in the form.');
      return;
    }

    this.isLoading = true;
    this.submissionMessage = null;
    this.submissionError = null;
    const formData = this.contactForm.value as ContactFormData;

    this.contactService.submitContactForm(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
                console.log("Form submitted with CAPTCHA token:", this.captchaToken);
          this.submissionMessage = response.message;
          // this.toastService.success('Message Sent!', response.message);
          alert(`Message Sent! ${response.message}`);
                setTimeout(() => {
        this.isLoading = false;
        alert("Message sent successfully!");
        this.contactForm.reset();
        this.captchaToken = null; // Reset CAPTCHA token
      }, 2000);
          this.contactForm.reset({
            name: '',
            email: '',
            message: '',
            improvementDescription: '',
            isNotRobot: false
          });
        } else {
      alert("Please complete reCAPTCHA and fill out all required fields.");
          this.submissionError = response.message || 'Failed to send message.';
          // this.toastService.error('Submission Error', this.submissionError);
          alert(`Submission Error: ${this.submissionError}`);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.submissionError = err.message || 'Something went wrong during submission.';
        console.error('Submission error:', err);
        // this.toastService.error('Submission Error', this.submissionError);
        alert(`Submission Error: ${this.submissionError}`);
      },
    });

  }


}
