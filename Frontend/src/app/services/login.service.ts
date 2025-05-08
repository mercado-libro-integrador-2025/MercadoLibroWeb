import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'https://mercadolibroweb.onrender.com/api/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    const clienteGuardado = localStorage.getItem('clienteLogueado');
    if (clienteGuardado) {
      this.isAuthenticatedSubject.next(true);
    }
  }
  
  registrarUsuario(username: string, email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/signup/`;
    const body = { username, email, password };
    return this.http.post(url, body, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  autenticarUsuario(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/login/`;
    const body = { email, password };
    return this.http.post(url, body, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }).pipe(
      tap({
        next: (response) => {
          // Si la autenticación es exitosa, cambia el estado de autenticación a true
          if (response) {
            this.isAuthenticatedSubject.next(true);
            localStorage.setItem('clienteLogueado', JSON.stringify(response));
          }
        },
        error: (error) => {
          console.error('Error al autenticar usuario:', error);
        }
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  logout(): void {
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem('clienteLogueado');
  }

  obtenerClienteLogueado(): any {
    const clienteLogueado = localStorage.getItem('clienteLogueado');
    console.log('Cliente obtenido del localStorage:', clienteLogueado);
    return clienteLogueado ? JSON.parse(clienteLogueado) : null;
  }
}