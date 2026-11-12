import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { Usuario } from '../modelos/usuario';
import { HttpClient } from '@angular/common/http';

@Service()
export class UsuariosService {
    
    private httpClient = inject(HttpClient);

    listar() {
        return this.httpClient.get<Usuario[]>(`${environment.apiUrl}/usuarios`);
    }

    crear(datos: FormData) {
        return this.httpClient.post<Usuario>(`${environment.apiUrl}/usuarios`, datos);
    }

    deshabilitar(id: string) {
        return this.httpClient.delete(`${environment.apiUrl}/usuarios/${id}`, {}) 
    }

    rehabilitar(id: string) {
        return this.httpClient.post(`${environment.apiUrl}/usuarios/${id}/rehabilitar`, {});
    }

    editarPerfil(datos: { nombre: string; apellido: string; fechaNacimiento: string; descripcion: string; equipoFavorito: string }) {
        return this.httpClient.put<Usuario>(`${environment.apiUrl}/usuarios/mi-perfil`, datos);
    }
}
