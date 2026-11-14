import { inject, Service, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from './auth';

@Service()
export class Sesion {

    private authService = inject(Auth);
    private router = inject(Router);
    private temporizador?: ReturnType<typeof setTimeout>;
    private cuentaRegresiva?: ReturnType<typeof setInterval>;

    mostrarAviso = signal(false);
    segundosRestantes = signal(15);
    cargando = signal(localStorage.getItem("token") !== null);

    iniciar() {
        this.detener();
        this.temporizador = setTimeout(() => this.avisar(), 45 * 1000);
    }

    private avisar() {
        this.segundosRestantes.set(15);
        this.mostrarAviso.set(true);

        this.cuentaRegresiva = setInterval(() => {
            this.segundosRestantes.update((segundos) => segundos - 1);

            if (this.segundosRestantes() <= 0) {
                this.cerrar();
            }
        }, 1000);
    }

    detener() {
        clearTimeout(this.temporizador);
        clearInterval(this.cuentaRegresiva);
        this.mostrarAviso.set(false);
    }

    cerrar() {
        this.detener();
        this.authService.cerrarSesion();
        this.router.navigate(['/login']);
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
        this.detener();

        this.authService.refrescar().subscribe({
            next: ({ token }) => {
                this.authService.guardarToken(token);
                this.iniciar();
            },
            error: () => this.cerrar(),
        });
    }
}