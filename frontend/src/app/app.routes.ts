import { Routes } from '@angular/router';
import { logueadoGuard } from './guards/logueado-guard';
import { invitadoGuard } from './guards/invitado-guard';
import { adminGuard } from './guards/admin-guard';

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
        path: "publicaciones/:id",
        loadComponent: () => import("./paginas/publicacion-detalle/publicacion-detalle").then(c => c.PublicacionDetalle),
        canActivate: [logueadoGuard]
    },
    {
        path: "mi-perfil",
        loadComponent: () => import("./paginas/mi-perfil/mi-perfil").then(c => c.MiPerfil),
        canActivate: [logueadoGuard]
    },
    {
        path: "dashboard/usuarios",
        loadComponent: () => import("./paginas/dashboard-usuarios/dashboard-usuarios").then(c => c.DashboardUsuarios),
        canActivate: [logueadoGuard, adminGuard]
    },
    {
        path: "**",
        redirectTo: "/login"
    }
];
