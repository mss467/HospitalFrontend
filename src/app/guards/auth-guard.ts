import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  if (role !== 'DOCTOR') {
    return router.createUrlTree(['/login']);
  }

  return true;
};
