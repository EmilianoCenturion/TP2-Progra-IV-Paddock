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
    segundosRestantes = signal(30);
    cargando = signal(localStorage.getItem("token") !== null);

    iniciar() {
        this.detener();

        const token = this.authService.obtenerToken();

        if (!token) {
            return;
        }

        // el token trae "exp" (en segundos): el aviso sale 30 segundos antes de que venza
        const vence = JSON.parse(atob(token.split('.')[1])).exp * 1000;
        const faltaParaAvisar = vence - 30 * 1000 - Date.now();

        this.temporizador = setTimeout(() => this.avisar(vence), Math.max(faltaParaAvisar, 0));
    }

    private avisar(vence: number) {
        this.mostrarAviso.set(true);

        const actualizar = () => {
            const restantes = Math.ceil((vence - Date.now()) / 1000);
            this.segundosRestantes.set(Math.max(restantes, 0));

            // un segundo de margen para que el back ya lo considere vencido y devuelva 401
            if (restantes <= -1) {
                this.vencer();
            }
        };

        actualizar();
        this.cuentaRegresiva = setInterval(actualizar, 1000);
    }

    ocultarAviso() {
        this.mostrarAviso.set(false);
    }

    private vencer() {
        this.detener();

        this.authService.autorizar().subscribe({
            next: () => this.cerrar(),
            error: () => {},
        });
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