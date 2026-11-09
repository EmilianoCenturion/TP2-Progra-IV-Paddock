import { inject, Service, signal } from '@angular/core';
import { Auth } from './auth';

@Service()
export class Sesion {

    private authService = inject(Auth);
    private temporizador?: ReturnType<typeof setTimeout>;

    mostrarAviso = signal(false);

    iniciar() {
        this.detener();
        this.temporizador = setTimeout(() => this.mostrarAviso.set(true), 45 * 1000);
    }

    detener() {
        clearTimeout(this.temporizador);
        this.mostrarAviso.set(false);
    }

    extender() {
        this.authService.refrescar().subscribe({
            next: ({ token }) => {
                this.authService.guardarToken(token);
                this.iniciar();
            },
            error: () => this.mostrarAviso.set(false), // si da 401, el interceptor lo manda al login
        });
    }
}