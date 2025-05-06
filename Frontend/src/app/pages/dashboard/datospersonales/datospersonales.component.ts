import { Component } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-datospersonales',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './datospersonales.component.html',
  styleUrls: ['./datospersonales.component.css']
})
export class DatospersonalesComponent {
  direccion: FormGroup;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService) {
    this.direccion = this.formBuilder.group({
      direccion: ['', Validators.required],
      ciudad: ['', Validators.required],
      provincia: ['', Validators.required],
      codigo_postal: ['', [Validators.required]]
    })
  }

  get Direccion() {
    return this.direccion.get('direccion');
  }

  get Ciudad() {
    return this.direccion.get('ciudad');
  }
  get Provincia() {
    return this.direccion.get('provincia');
  }
  get CodigoPostal() {
    return this.direccion.get('codigo_postal');
  }

}