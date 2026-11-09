import { Component, inject, signal } from '@angular/core';
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
  cargando = signal(true);

  ngOnInit() {
    setTimeout(() => this.validarSesion(), 1500);
  }

  private validarSesion() {
    if (!this.authService.obtenerToken()) {
      this.authService.cerrarSesion();
      this.cargando.set(false);
      return;
    }

    this.authService.autorizar().subscribe({
      next: (usuario) => {
        this.authService.actualizarUsuario(usuario);
        this.sesion.iniciar();
        this.cargando.set(false);
        this.router.navigate(['/publicaciones']);
      },
      error: () => {
        this.authService.cerrarSesion();
        this.cargando.set(false);
        this.router.navigate(['/login']);
      },
    });
  }

  noExtender() {
    this.sesion.detener();
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}