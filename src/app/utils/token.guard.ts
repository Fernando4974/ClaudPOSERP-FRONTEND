import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
export const tokenGuard: CanActivateFn = (route, state) => {
   const token = localStorage.getItem('token');
  const router = inject(Router);

  if (token) {
    return true; // El usuario tiene un token, se le permite el acceso.
  } else {
    router.navigate(['/login']); // No tiene token, lo redirigimos a la página de login.
    return false; // Se bloquea la navegación.
  }

};
