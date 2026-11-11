import { inject, Service, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from './auth';

@Service()
export class Sesion {

    private authService = inject(Auth);
    private router = inject(Router);
    private temporizador?: ReturnType<typeof setTimeout>;

    mostrarAviso = signal(false);
    cargando = signal(localStorage.getItem("token") !== null);

    iniciar() {
        this.detener();
        this.temporizador = setTimeout(() => this.mostrarAviso.set(true), 45 * 1000);
    }

    detener() {
        clearTimeout(this.temporizador);
        this.mostrarAviso.set(false);
    }

    validar() {
        if (!this.authService.obtenerToken()) {
            this.authService.cerrarSesion();
            this.cargando.set(false);
            return;
        }

        this.cargando.set(true);

        setTimeout(() => {
            this.authService.autorizar().subscribe({
                next: (usuario) => {
                    this.authService.actualizarUsuario(usuario);
                    this.iniciar();
                    this.cargando.set(false);
                    this.router.navigate(['/publicaciones']);
                },
                error: () => {
                    this.detener();
                    this.authService.cerrarSesion();
                    this.cargando.set(false);
                    this.router.navigate(['/login']);
                },
            });
        }, 3000);
    }

    extender() {
        this.mostrarAviso.set(false);

        this.authService.refrescar().subscribe({
            next: ({ token }) => {
                this.authService.guardarToken(token);
                this.iniciar();
            }
        });
    }
}