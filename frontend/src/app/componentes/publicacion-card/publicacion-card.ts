import { Component, Input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Publicacion } from '../../modelos/publicacion';
import { colorEquipo } from '../../utils/equipos';

@Component({
  imports: [DatePipe],
  selector: 'app-publicacion-card',
  styleUrl: './publicacion-card.css',
  templateUrl: './publicacion-card.html',
})
export class PublicacionCard {
  @Input({ required: true }) publicacion!: Publicacion;
  @Input() meGusta = false;
  @Input() puedeEliminar = false;

  like = output();
  eliminar = output();

  colorEquipo = colorEquipo;
}