import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  datosContacto: any;

  constructor() { }

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

}
