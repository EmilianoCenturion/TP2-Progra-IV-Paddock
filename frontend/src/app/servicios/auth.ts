import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Usuario } from '../modelos/usuario';

@Service()
export class Auth {

    private httpClient = inject(HttpClient)

    usuario = signal<Usuario | null>(this.obtenerUsuario());

    login(datos: { usuario: string; contrasena: string} ) {
        return this.httpClient.post<Usuario>(`${environment.apiUrl}/auth/login`, datos)
    }

    registro(datos: FormData) {
        return this.httpClient.post<Usuario>(`${environment.apiUrl}/auth/registro`, datos)
    }

    guardarSesion(usuario: Usuario) {
        localStorage.setItem('usuario', JSON.stringify(usuario));
        this.usuario.set(usuario);
    }

    cerrarSesion() {
        localStorage.removeItem('usuario');
        this.usuario.set(null);
    }

    private obtenerUsuario(): Usuario | null {
        const guardado = localStorage.getItem('usuario');
        return guardado ? JSON.parse(guardado) : null;
    }
}
