import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-registro',
  styleUrl: './registro.css',
  templateUrl: './registro.html',
})
export class Registro {
  
  form! : FormGroup;

  imagen?: File;

  constructor (private fb: FormBuilder) {
    
    this.form = this.fb.group({
      nombre: ["", Validators.required],
      apellido: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      nombreUsuario : ["", Validators.required],
      contrasena: ["", [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)]],
      repetirContrasena: ["", Validators.required],
      fechaNacimiento: ["", Validators.required],
      equipoFavorito: [""],
      descripcion: ["", [Validators.required, Validators.maxLength(300)]]
    })
  }

  invalido(campo: string) {
    if (this.form.get(campo)?.invalid && this.form.get(campo)?.touched) {
      return true;
    }

    return false;
  }

  elegirImagen(e: Event) {
    const input = e.target as HTMLInputElement;

    this.imagen = input.files?.[0];
  }

  registrar() {
    console.log(this.form.value);
  }
}
