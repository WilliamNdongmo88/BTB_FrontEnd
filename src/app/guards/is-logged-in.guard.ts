import { CanActivateFn, Router } from '@angular/router';
import { catchError, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const isLoggedInGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    if (authService.user() == undefined) {
      return authService.getUser().pipe(
        map(_ => true),
        catchError(_ => router.navigate(['login']))
      )
    }
    console.log('authService user :: '+ !authService.user());
    if (!authService.user()) {
      router.navigate(['login']);
    }

    return true;
};
