import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../servicios/auth';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.usuario()?.perfil === "administrador") {
    return true;
  }

  return router.createUrlTree(["/publicaciones"]);
};