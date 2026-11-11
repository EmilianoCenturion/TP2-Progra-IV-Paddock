import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../servicios/auth';
import { Sesion } from '../../servicios/sesion';
import { InicialesPipe } from '../../pipes/iniciales-pipe';
import { ColorEquipo } from '../../directivas/color-equipo';
import { SoloAdmin } from '../../directivas/solo-admin';
import { ImagenRespaldo } from '../../directivas/imagen-respaldo';

@Component({
  imports: [RouterLink, RouterLinkActive, InicialesPipe, ColorEquipo, SoloAdmin, ImagenRespaldo],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {

  private authService = inject(Auth);
  private router = inject(Router);
  private sesion = inject(Sesion);

  usuario = this.authService.usuario;
  salir() {
    this.sesion.detener();
    this.authService.cerrarSesion();
    this.router.navigate(["/login"]);
  }
}
