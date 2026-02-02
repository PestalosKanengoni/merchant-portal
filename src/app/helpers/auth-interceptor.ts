import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  //const token = localStorage.getItem('accessToken');
  const rawData = localStorage.getItem('auth-user');
  let token = null;

  if (rawData) {
    try {
      const parsedData = JSON.parse(rawData);
      // Access the accessToken property inside the object
      token = parsedData.accessToken;
    } catch (e) {
      console.error('Error parsing token from storage', e);
    }
  }

  console.log('Intercepted Token:', token);

  console.log('accessToken',token)

  if (req.url.includes('/auth/login')) {
    return next(req);
  }

  let headers = new HttpHeaders()


  // 1. Clone the request and add the Bearer token if it exists
  let clonedReq = req;
  if (token) {

    clonedReq = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Cloned request headers:', clonedReq.headers.keys());

  }




  // 2. Handle the request and intercept 401 (Unauthorized) errors
  return next(clonedReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        console.warn('Unauthorized request - Redirecting to login');
        window.sessionStorage.clear();
        localStorage.removeItem('token'); // Clear the expired token
        router.navigate(['/login'], { replaceUrl: true });

        window.history.pushState(null, '', window.location.href);
      }
      return throwError(() => error);
    })
  );



};


