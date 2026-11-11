import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from './componentes/navbar/navbar';
import { Cargando } from './componentes/cargando/cargando';
import { Auth } from './servicios/auth';
import { Sesion } from './servicios/sesion';

@Component({
  imports: [RouterOutlet, Navbar, Cargando],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private authService = inject(Auth);
  private router = inject(Router);

  sesion = inject(Sesion);
  usuario = this.authService.usuario;

  ngOnInit() {
    this.sesion.validar();
  }

  noExtender() {
    this.sesion.detener();
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}