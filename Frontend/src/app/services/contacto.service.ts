import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import type {
  ContactFormData,
  ImproveMessageInput,
  ImproveMessageOutput,
  ApiResponse,
} from './models/contacto.models';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  datosContacto: any;

    // Replace with your actual API endpoints
  private readonly submitApiUrl = '/api/contact'; // Example endpoint
  private readonly improveApiUrl = '/api/improve-message'; // Example endpoint for Genkit flow

  constructor(private http: HttpClient) {}

  getDatosContacto() {
    this.datosContacto = [
      { telefono: 351456789 },
      { ubicacion: "Cordoba, Argentina" },
      { facebook: "Facebook" },
      { instagram: "Instagram" },
      { twitter: "Twitter" },
      { linkedin: "Linkedin" },
    ];
    return this.datosContacto;
  }

  submitContactForm(data: ContactFormData): Observable<ApiResponse> {
    console.log('Submitting contact form data (Angular Service):', data);
    // In a real application, this would make an HTTP POST request to your backend
    // return this.http.post<ApiResponse>(this.submitApiUrl, data)
    //   .pipe(catchError(this.handleError));

    // Simulate API call
    return new Observable<ApiResponse>((observer) => {
      setTimeout(() => {
        // Simulate a successful submission
        observer.next({ success: true, message: 'Your message has been sent successfully! (Simulated)' });
        // To simulate an error:
        // observer.error({ success: false, message: 'An error occurred. Please try again. (Simulated)' });
        observer.complete();
      }, 1500);
    }).pipe(delay(1500)); // Simulate network latency
  }

  improveMessage(input: ImproveMessageInput): Observable<ImproveMessageOutput> {
    console.log('Requesting message improvement (Angular Service):', input);
    // In a real application, this would make an HTTP POST request to your AI backend/Genkit flow endpoint
    // return this.http.post<ImproveMessageOutput>(this.improveApiUrl, input)
    //   .pipe(catchError(this.handleError));

    // Simulate API call to the Genkit flow
    return new Observable<ImproveMessageOutput>((observer) => {
      setTimeout(() => {
        const improved = `AI Improved: "${input.originalMessage}" based on "${input.improvementDescription}". This is a simulated AI response.`;
        observer.next({ improvedMessage: improved });
        observer.complete();
      }, 1000);
    }).pipe(delay(1000));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

}
