import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const storageService = inject(StorageService);
  const router = inject(Router);
  const user = storageService.getUser();


  console.log("logged in user",user)
  if (!storageService.isLoggedIn()) {

    router.navigate(['/login'], { replaceUrl: true });
    return false;
  }
  return true;
};

export const guestGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);
  const user = storageService.getUser();

   console.log("logged in user",user)
  if (storageService.isLoggedIn()) {
    router.navigate(['/merchant-overview'], { replaceUrl: true });
    return false;
  }

  return true;
};

// password-check.guard.ts - Password expiry guard
export const passwordCheckGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);
  const user = storageService.getUser();

  if (user?.user?.passwordExpired === true && state.url !== '/register') {
    router.navigate(['/register'], { replaceUrl: true });
    return false;
  }

  if (user?.user?.passwordExpired !== true && state.url === '/register') {
    router.navigate(['/merchant-overview'], { replaceUrl: true });
    return false;
  }

  return true;
};
