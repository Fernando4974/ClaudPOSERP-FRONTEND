import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  const token = sessionStorage.getItem('token');
  const refreshToken = sessionStorage.getItem('refreshToken');

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && refreshToken) {
        return userService.refreshToken(refreshToken).pipe(
          switchMap((res: any) => {
            sessionStorage.setItem('token', res.token);
            sessionStorage.setItem('refreshToken', res.refreshToken);
            const sesions = {
              token: sessionStorage.getItem('token'),
              Rtoken: sessionStorage.getItem('refreshToken'),
            };
            //console.log(sesions)
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${res.token}` },
            });

            return next(retryReq);
          }),
          catchError((refreshErr) => {
            // Si el refresh falla (ej. pasaron los 7 días), cerramos sesión
            userService.logOut();
            return throwError(() => refreshErr);
          }),
        );
      }

      // Si es otro tipo de error, lo lanzamos normalmente
      return throwError(() => error);
    }),
  );
};
