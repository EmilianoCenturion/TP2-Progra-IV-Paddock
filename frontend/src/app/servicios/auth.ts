import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../environments/environment';

@Service()
export class Auth {

    private httpClient = inject(HttpClient)

    login(datos: { usuario: string; contrasena: string} ) {
        return this.httpClient.post(`${environment.apiUrl}/auth/login`, datos)
    }

    registro(datos: FormData) {
        return this.httpClient.post(`${environment.apiUrl}/auth/registro`, datos)
    }
}
