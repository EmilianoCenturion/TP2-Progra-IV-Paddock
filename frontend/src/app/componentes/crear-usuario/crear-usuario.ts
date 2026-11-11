import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosService } from '../../servicios/usuarios';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-crear-usuario',
  styleUrl: './crear-usuario.css',
  templateUrl: './crear-usuario.html',
})
export class CrearUsuario {
  private usuariosService = inject(UsuariosService);
  private fb = inject(FormBuilder);

  creado = output();
  cancelado = output();

  error = signal('');
  enviando = signal(false);

  imagen?: File;

  form: FormGroup = this.fb.group({
    perfil: ["usuario", Validators.required],
    nombre: ["", Validators.required],
    apellido: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    nombreUsuario: ["", Validators.required],
    contrasena: ["", [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)]],
    repetirContrasena: ["", Validators.required],
    fechaNacimiento: ["", Validators.required],
    equipoFavorito: [""],
    descripcion: ["", [Validators.required, Validators.maxLength(300)]],
  });

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

  crear() {
    this.error.set("");

    if (this.form.value.contrasena !== this.form.value.repetirContrasena) {
      this.error.set("Las contraseñas no coinciden");
      return;
    }

    const datos = new FormData();

    datos.append("perfil", this.form.value.perfil);
    datos.append("nombre", this.form.value.nombre);
    datos.append("apellido", this.form.value.apellido);
    datos.append("email", this.form.value.email);
    datos.append("nombreUsuario", this.form.value.nombreUsuario);
    datos.append("contrasena", this.form.value.contrasena);
    datos.append("repetirContrasena", this.form.value.repetirContrasena);
    datos.append("fechaNacimiento", this.form.value.fechaNacimiento);
    datos.append("descripcion", this.form.value.descripcion);

    if (this.form.value.equipoFavorito) {
      datos.append("equipoFavorito", this.form.value.equipoFavorito);
    }

    if (this.imagen) {
      datos.append("imagen", this.imagen);
    }

    this.enviando.set(true);

    this.usuariosService.crear(datos).subscribe({
      next: () => this.creado.emit(),
      error: (err) => {
        this.enviando.set(false);

        if (err.status === 0) {
          this.error.set("No pudimos conectar con el servidor");
        } else {
          this.error.set(err.error.message);
        }
      },
    });
  }
}