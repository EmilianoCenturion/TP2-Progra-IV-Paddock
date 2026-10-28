import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../servicios/auth';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-registro',
  styleUrl: './registro.css',
  templateUrl: './registro.html',
})
export class Registro {
  
  mensajeError = signal("");

  form! : FormGroup;

  imagen?: File;

  constructor (private fb: FormBuilder, private authService: Auth, private router: Router) {
    
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
  
    this.mensajeError.set("");

    if ( this.form.value.contrasena !== this.form.value.repetirContrasena) {
      this.mensajeError.set("Las contraseñas no coinciden");
      return;
    }

    const datos = new FormData();

    datos.append("nombre", this.form.value.nombre);
    datos.append("apellido", this.form.value.apellido);
    datos.append("email", this.form.value.email);
    datos.append("nombreUsuario", this.form.value.nombreUsuario);
    datos.append("contrasena", this.form.value.contrasena);
    datos.append("repetirContrasena", this.form.value.repetirContrasena);
    datos.append("fechaNacimiento", this.form.value.fechaNacimiento);
    
    if (this.form.value.equipoFavorito) {
      datos.append("equipoFavorito", this.form.value.equipoFavorito);
    }
    
    if (this.imagen) {
      datos.append("imagen", this.imagen);
    }

    datos.append("descripcion", this.form.value.descripcion);

    this.authService.registro(datos).subscribe({
      next: () => {
        this.router.navigate(["/login"]);
      },
      error: (err) => {
        if (err.status === 0) {
          this.mensajeError.set("No pudimos conectar con el servidor");
        } else {
          this.mensajeError.set(err.error.message);
        }
      }})
  }
}
