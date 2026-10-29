import { Routes } from '@angular/router';
import { logueadoGuard } from './guards/logueado-guard';
import { invitadoGuard } from './guards/invitado-guard';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/login",
        pathMatch: "full"
    },
    {
        path: "registro",
        loadComponent: () => import("./paginas/registro/registro").then(c => c.Registro),
        canActivate: [invitadoGuard]
    },
    {
        path: "login",
        loadComponent: () => import("./paginas/login/login").then(c => c.Login),
        canActivate: [invitadoGuard]
    },
    {
        path: "publicaciones",
        loadComponent: () => import("./paginas/publicaciones/publicaciones").then(c => c.Publicaciones),
        canActivate: [logueadoGuard]
    },
    {
        path: "mi-perfil",
        loadComponent: () => import("./paginas/mi-perfil/mi-perfil").then(c => c.MiPerfil),
        canActivate: [logueadoGuard]
    },
    {
        path: "**",
        redirectTo: "/login"
    }
];
