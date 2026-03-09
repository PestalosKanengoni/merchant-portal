import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage';

export const passwordCheckGuard: CanActivateFn = () => {
  const router = inject(Router);
  const storageService = inject(StorageService);

  const user = storageService.getUser();

  // If password is expired, redirect to register (password reset)
  if (user && user.user && user.user.passwordExpired) {
    router.navigate(['/register']);
    return false;
  }
  return true;
};
