import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "/login",
        pathMatch: "full"
    },
    {
        path: "registro",
        loadComponent: () => import("./paginas/registro/registro").then(c => c.Registro)
    },
    {
        path: "login",
        loadComponent: () => import("./paginas/login/login").then(c => c.Login)
    },
    {
        path: "publicaciones",
        loadComponent: () => import("./paginas/publicaciones/publicaciones").then(c => c.Publicaciones)
    },
    {
        path: "mi-perfil",
        loadComponent: () => import("./paginas/mi-perfil/mi-perfil").then(c => c.MiPerfil)
    },
    {
        path: "**",
        redirectTo: "/login"
    }
];
