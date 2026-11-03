import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../servicios/auth';
import { colorEquipo } from '../../utils/equipos';

@Component({
  imports: [ RouterLink, RouterLinkActive ],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {

  private authService = inject(Auth);
  private router = inject(Router);

  usuario = this.authService.usuario;

  colorEquipo = colorEquipo;

  salir() {
    this.authService.cerrarSesion();
    this.router.navigate(["/login"]);
  }
}
