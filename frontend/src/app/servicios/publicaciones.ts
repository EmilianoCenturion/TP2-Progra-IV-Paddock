import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import { Publicacion, RespuestaPublicaciones } from '../modelos/publicacion';

@Service()
export class PublicacionesService {

    private httpClient = inject(HttpClient);
    

    listar(orden: string, offset: number, limit: number, usuario?: string) {
        let url = `${environment.apiUrl}/publicaciones?orden=${orden}&offset=${offset}&limit=${limit}`;

        if (usuario) {
            url += `&usuario=${usuario}`;
        }

        return this.httpClient.get<RespuestaPublicaciones>(url);
    }

    eliminar(id: string, usuario: string, perfil: string) {
        return this.httpClient.delete(`${environment.apiUrl}/publicaciones/${id}`, {
            body: { usuario, perfil } 
        })
    }

    crear(datos: FormData) {
        return this.httpClient.post<Publicacion>(`${environment.apiUrl}/publicaciones`, datos);
    }

    darLike(id: string, usuario: string) {
        return this.httpClient.post<{ cantidadLikes: number }>(`${environment.apiUrl}/publicaciones/${id}/like`, { usuario })
    }

    quitarLike(id: string, usuario: string) {
        return this.httpClient.delete<{ cantidadLikes: number }>(`${environment.apiUrl}/publicaciones/${id}/like`, {
            body: { usuario }
        }) 
    }
}


