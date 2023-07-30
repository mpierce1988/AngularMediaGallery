import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const service = inject(AuthService);
  return service.isLoggedIn().pipe(
    tap(
      (isLoggedIn) => {
        if (!isLoggedIn) {
          return router.navigate(['/login']);
        }

        return true;
      }
    ) 
  );
  return true;
};
