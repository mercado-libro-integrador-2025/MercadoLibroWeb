import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly _http = inject(HttpClient);
  private readonly _usuariosUrl = 'assets/data/usuarios.json'; // URL del archivo JSON de usuarios
  

  constructor() {}

  getUsuarios(): Observable<any> {
    return this._http.get(this._usuariosUrl);
  }

  getUsuarioPorId(id: number): Observable<any> {
    return this.getUsuarios().pipe(
      map((usuarios: any[]) => usuarios.find(usuario => usuario.id === id))
    );
  }

  editarUsuario(usuarioActualizado: any): Observable<any> {
    return this.getUsuarios().pipe(
      map((usuarios: any[]) => {
        const index = usuarios.findIndex(user => user.id === usuarioActualizado.id);
        if (index !== -1) {
          usuarios[index] = usuarioActualizado;
        
        }
        return usuarioActualizado;
      })
    );
  }
}
