import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../servicios/auth';
import { colorEquipo } from '../../utils/equipos';
import { Sesion } from '../../servicios/sesion';


@Component({
  imports: [ RouterLink, RouterLinkActive ],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {

  private authService = inject(Auth);
  private router = inject(Router);
  private sesion = inject(Sesion);

  usuario = this.authService.usuario;

  colorEquipo = colorEquipo;

  salir() {
    this.sesion.detener();
    this.authService.cerrarSesion();
    this.router.navigate(["/login"]);
  }
}
