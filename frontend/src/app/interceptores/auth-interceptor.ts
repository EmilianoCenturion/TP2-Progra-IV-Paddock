import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Auth } from '../servicios/auth';
import { Sesion } from '../servicios/sesion';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const sesion = inject(Sesion);
  const router = inject(Router);
  const token = authService.obtenerToken();

  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // el login con datos incorrectos también devuelve 401: ahí hay que mostrar el mensaje, no redirigir
      if (err.status === 401 && !req.url.endsWith('/auth/login')) {
        sesion.detener();
        authService.cerrarSesion();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    }),
  );
};