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
          // Si la autenticación es exitosa se cambia el estado de autenticación a true
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

  cliente: any;
 // Decodificar el token
  decodeJWT(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('El token JWT es inválido');
    }

    // Decodificar la primera parte (Header) y la segunda parte (Payload) en Base64
    const decodedPayload = atob(parts[1]);  // Decodificamos el payload en base64
    return JSON.parse(decodedPayload);  // Convertimos el payload a un objeto JSON
  }

  isAccessTokenExpired(): boolean {
    const cliente = this.obtenerClienteLogueado();
    if (!cliente || !cliente.access) {
      return true; // Si no hay token, está expirado
    }

    try {
      const decoded: any = this.decodeJWT(cliente.access);  // Decodica el token
      const now = Date.now().valueOf() / 1000;  // tiempo actual
      const expTime = decoded.exp;  // Tiempo de expiración del token

    // Log para saber cuando expira el token
      console.log(`Token expira en: ${new Date(expTime * 1000).toLocaleString()}`);
      console.log(`Tiempo actual: ${new Date(now * 1000).toLocaleString()}`);

      return decoded.exp < now;  // Comparo la fecha de expiración
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return true;  // Si hubo un error al decodificar,  cuenta como expirado
    }
  }

//Servicios para el perfil del cliente en el dashboard

obtenerDirecciones(): Observable<any[]> {
  const cliente = this.obtenerClienteLogueado();
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${cliente?.access}`
  });

  return this.http.get<any[]>('https://mercadolibroweb.onrender.com/api/direcciones/', { headers });
}

crearDireccion(direccion: any): Observable<any> {
  const cliente = this.obtenerClienteLogueado();
  if (!cliente?.access) {
    throw new Error('Token de acceso no disponible.');
  }
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${cliente.access}`,
    'Content-Type': 'application/json'
  });

  const url = 'https://mercadolibroweb.onrender.com/api/direcciones/'; 

  return this.http.post(url, direccion, { headers });
}


editarDireccion(id: number, direccion: any): Observable<any> {
  const cliente = this.obtenerClienteLogueado();
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${cliente?.access}`,
    'Content-Type': 'application/json'
  });

  return this.http.put(`https://mercadolibroweb.onrender.com/api/direcciones/${id}/`, direccion, { headers });
}

eliminarDireccion(id: number): Observable<any> {
  const cliente = this.obtenerClienteLogueado();
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${cliente?.access}`
  });

  return this.http.delete(`https://mercadolibroweb.onrender.com/api/direcciones/${id}/`, { headers });
}

eliminarCuenta(): Observable<any> {
  const cliente = this.obtenerClienteLogueado();
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${cliente?.access}`
  });

  return this.http.delete(`https://mercadolibroweb.onrender.com/api/usuarios/${cliente.user.id}/`, { headers });
}

actualizarDatosPersonales(username: string, email: string, password: string): Observable<any> {
  const cliente = this.obtenerClienteLogueado();
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${cliente?.access}`,
    'Content-Type': 'application/json'
  });

  const url = `https://mercadolibroweb.onrender.com/api/usuarios/${cliente.user.id}/`;
  const body = { username, email, password };

  return this.http.put(url, body, { headers });
}

}
