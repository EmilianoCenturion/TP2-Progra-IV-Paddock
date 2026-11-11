import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Auth } from '../../servicios/auth';
import { PublicacionesService } from '../../servicios/publicaciones';
import { Publicacion } from '../../modelos/publicacion';
import { PublicacionCard } from '../../componentes/publicacion-card/publicacion-card';
import { InicialesPipe } from '../../pipes/iniciales-pipe';
import { ColorEquipo } from '../../directivas/color-equipo';
import { ImagenRespaldo } from '../../directivas/imagen-respaldo';

@Component({
  imports: [DatePipe, PublicacionCard, InicialesPipe, ColorEquipo, ImagenRespaldo],
  selector: 'app-mi-perfil',
  styleUrl: './mi-perfil.css',
  templateUrl: './mi-perfil.html',
})
export class MiPerfil {
  private publicacionesService = inject(PublicacionesService);

  usuario = inject(Auth).usuario;
  publicaciones = signal<Publicacion[]>([]);
  cargando = signal(true);
  error = signal('');
  ngOnInit() {
    this.cargar();
  }

  cargar() {
    const id = this.usuario()?._id;
    if (!id) return;

    this.publicacionesService.listar('fecha', 0, 3, id).subscribe({
      next: (respuesta) => {
        this.publicaciones.set(respuesta.publicaciones);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No pudimos cargar tus publicaciones');
        this.cargando.set(false);
      },
    });
  }

  dioLike(publicacion: Publicacion) {
    return publicacion.likes.includes(this.usuario()?._id ?? '');
  }

  alternarLike(publicacion: Publicacion) {
    const id = this.usuario()?._id;
    if (!id) return;

    const pedido = this.dioLike(publicacion)
      ? this.publicacionesService.quitarLike(publicacion._id)
      : this.publicacionesService.darLike(publicacion._id);

    pedido.subscribe({
      next: () => this.cargar(),
      error: () => this.error.set('No pudimos actualizar el like'),
    });
  }
}