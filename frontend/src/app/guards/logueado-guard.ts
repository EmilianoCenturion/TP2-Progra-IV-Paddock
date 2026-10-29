import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../servicios/auth';
import { inject } from '@angular/core';

export const logueadoGuard: CanActivateFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.usuario()) {
    return true;
  }

  return router.createUrlTree(["/login"]);
};
