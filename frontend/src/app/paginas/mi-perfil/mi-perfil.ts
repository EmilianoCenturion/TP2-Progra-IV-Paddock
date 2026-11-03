import { Component, inject } from '@angular/core';
import { Auth } from '../../servicios/auth';
import { DatePipe} from '@angular/common';
import { colorEquipo } from '../../utils/equipos';

@Component({
  imports: [ DatePipe],
  selector: 'app-mi-perfil',
  styleUrl: './mi-perfil.css',
  templateUrl: './mi-perfil.html',
})
export class MiPerfil {
  usuario = inject(Auth).usuario;

  colorEquipo = colorEquipo;
}
