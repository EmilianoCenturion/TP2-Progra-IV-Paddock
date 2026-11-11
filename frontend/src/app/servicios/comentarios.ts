import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { Comentario, RespuestaComentarios } from '../modelos/comentario';

@Service()
export class ComentariosService {

    private httpClient = inject(HttpClient);

    listar(publicacionId: string, offset: number, limit: number) {
        const url = `${environment.apiUrl}/publicaciones/${publicacionId}/comentarios?offset=${offset}&limit=${limit}`;

        return this.httpClient.get<RespuestaComentarios>(url);
    }

    crear(publicacionId: string, mensaje: string) {
        return this.httpClient.post<Comentario>(`${environment.apiUrl}/publicaciones/${publicacionId}/comentarios`, { mensaje });
    }

    editar(publicacionId: string, id: string, mensaje: string) {
        return this.httpClient.put<Comentario>(`${environment.apiUrl}/publicaciones/${publicacionId}/comentarios/${id}`, { mensaje });
    }
}
