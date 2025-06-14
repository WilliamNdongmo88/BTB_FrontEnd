import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const isLoggedInGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser();
  console.log('[isLoggedInGuard] user :: ' + JSON.stringify(user))
  if (authService.isLoggedIn() && user ) {
    return true;
  }

  router.navigate(['login']);
  return false;
};

// export const isLoggedInGuard: CanActivateFn = (route, state) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   console.log('[isLoggedInGuard] ::: ' + authService.isLoggedIn())
//   if (!authService.isLoggedIn()) {
//     router.navigate(['/login']);
//     return false;
//   }

//   return true;
// };