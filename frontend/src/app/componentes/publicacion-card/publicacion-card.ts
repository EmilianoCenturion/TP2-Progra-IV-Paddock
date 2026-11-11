import { Component, inject, Input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Publicacion } from '../../modelos/publicacion';
import { Comentario } from '../../modelos/comentario';
import { ComentariosService } from '../../servicios/comentarios';
import { colorEquipo } from '../../utils/equipos';

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-publicacion-card',
  styleUrl: './publicacion-card.css',
  templateUrl: './publicacion-card.html',
})
export class PublicacionCard {
  private comentariosService = inject(ComentariosService);

  @Input({ required: true }) publicacion!: Publicacion;
  @Input() meGusta = false;
  @Input() puedeEliminar = false;
  @Input() conLink = true;

  like = output();
  eliminar = output();

  comentarios = signal<Comentario[]>([]);

  colorEquipo = colorEquipo;

  ngOnInit() {
    if (this.conLink && this.publicacion.cantidadComentarios > 0) {
      this.comentariosService.listar(this.publicacion._id, 0, 2).subscribe({
        next: (respuesta) => this.comentarios.set(respuesta.comentarios),
      });
    }
  }
}