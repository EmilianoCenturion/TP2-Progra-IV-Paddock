import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../servicios/auth';
import { PublicacionesService } from '../../servicios/publicaciones';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-crear-publicacion',
  styleUrl: './crear-publicacion.css',
  templateUrl: './crear-publicacion.html',
})
export class CrearPublicacion {
  private publicacionesService = inject(PublicacionesService);
  private usuario = inject(Auth).usuario;

  creada = output();
  cancelada = output();

  imagen: File | null = null;
  enviando = signal(false);
  error = signal('');

  form = inject(FormBuilder).nonNullable.group({
    titulo: ['', Validators.required],
    mensaje: ['', Validators.required],
  });

  elegirImagen(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.imagen = input.files?.[0] ?? null;
  }

  publicar(archivo: HTMLInputElement) {
    const usuario = this.usuario();

    if (this.form.invalid || !usuario) {
      this.form.markAllAsTouched();
      return;
    }

    const datos = new FormData();
    datos.append('titulo', this.form.getRawValue().titulo);
    datos.append('mensaje', this.form.getRawValue().mensaje);

    if (this.imagen) {
      datos.append('imagen', this.imagen);
    }

    this.enviando.set(true);
    this.error.set('');

    this.publicacionesService.crear(datos).subscribe({
      next: () => {
        this.form.reset();
        this.imagen = null;
        archivo.value = '';
        this.enviando.set(false);
        this.creada.emit();
      },
      error: () => {
        this.error.set('No pudimos crear la publicación. Revisá la imagen e intentá de nuevo.');
        this.enviando.set(false);
      },
    });
  }
}