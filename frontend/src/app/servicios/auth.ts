import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { RespuestaAuth, Usuario } from '../modelos/usuario';

@Service()
export class Auth {

    private httpClient = inject(HttpClient);

    usuario = signal<Usuario | null>(this.obtenerUsuario());

    login(datos: { usuario: string; contrasena: string }) {
        return this.httpClient.post<RespuestaAuth>(`${environment.apiUrl}/auth/login`, datos);
    }

    registro(datos: FormData) {
        return this.httpClient.post<RespuestaAuth>(`${environment.apiUrl}/auth/registro`, datos);
    }

    autorizar() {
        return this.httpClient.post<Usuario>(`${environment.apiUrl}/auth/autorizar`, {});
    }

    refrescar() {
        return this.httpClient.post<{ token: string }>(`${environment.apiUrl}/auth/refrescar`, {});
    }

    guardarSesion(respuesta: RespuestaAuth) {
        localStorage.setItem('token', respuesta.token);
        this.actualizarUsuario(respuesta.usuario);
    }

    actualizarUsuario(usuario: Usuario) {
        localStorage.setItem('usuario', JSON.stringify(usuario));
        this.usuario.set(usuario);
    }

    guardarToken(token: string) {
        localStorage.setItem('token', token);
    }

    obtenerToken() {
        return localStorage.getItem('token');
    }

    cerrarSesion() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        this.usuario.set(null);
    }

    private obtenerUsuario(): Usuario | null {
        const guardado = localStorage.getItem('usuario');
        return guardado ? JSON.parse(guardado) : null;
    }
}