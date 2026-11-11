import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';

@Service()
export class Estadisticas {

    private httpClient = inject(HttpClient);

    publicacionesPorUsuario(desde: string, hasta: string) {
        return this.httpClient.get<{ nombreUsuario: string; equipoFavorito?: string; imagenUrl?: string; cantidad: number }[]>(`${environment.apiUrl}/estadisticas/publicaciones-por-usuario`, { params: { desde, hasta }});
    }

    comentariosPorDia(desde: string, hasta: string) {
        return this.httpClient.get< { fecha: string; cantidad: number }[]>(`${environment.apiUrl}/estadisticas/comentarios`, { params: { desde, hasta }});
    }

    comentariosPorPublicacion(desde: string, hasta: string) {
        return this.httpClient.get<{ titulo: string; cantidad: number }[]>(`${environment.apiUrl}/estadisticas/comentarios-por-publicacion`, { params: { desde, hasta }});
    }
}
