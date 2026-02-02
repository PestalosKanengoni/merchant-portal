import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { StorageService } from '../services/storage';

const AUTH_API = 'http://192.168.4.13:8099/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})


export class Auth {

  private storageService = inject(StorageService)

  register$ = new Subject();


  constructor(private http: HttpClient,private router: Router){}

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'login',
      {
        username,
        password,}).pipe(
          tap((response: any)=>{
            if(response){
              this.storageService.saveUser(response);
              console.log('User saved after login:', response);
            }
          })
        );
  }

  changePassword(currentPassword: string, newPassword: string, confirmationPassword: string): Observable<any> {

    const token = this.storageService.getToken();

    console.log('=== CHANGE PASSWORD DEBUG ===');
    console.log('Token exists:', !!token);
    console.log('Token value:', token);

    console.log('Parameters received:');
  console.log('  currentPassword:', currentPassword);
  console.log('  newPassword:', newPassword);
  console.log('  confirmationPassword:', confirmationPassword);

    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })

    const body = {
      currentPassword: currentPassword,
      newPassword: newPassword,
      confirmationPassword: confirmationPassword
    };

    console.log('Request body:', body);
    console.log('Headers:', headers.keys());


  return this.http.post(AUTH_API+'changePassword',body, { headers });
}

  //   logout(): Observable<any> {
  //   return this.http.post(AUTH_API + 'signout', { });
  // }
  async logout(): Promise<void> {
    // Clear OTP verification flag
    this.storageService.clearOtpVerified();
  // Clear all stored data
  this.storageService.clean();

  // Navigate to login page with replaceUrl to replace history
  await this.router.navigate(['/login'], {
    replaceUrl: true  // THIS IS CRUCIAL
  });

  // Clear navigation history to prevent back button
  this.clearNavigationHistory();
}

private clearNavigationHistory(): void {
  // Replace entire history with login page
  window.history.pushState(null, '', window.location.href);
}
  //{
    // // 1. Clear tokens from storage
    // localStorage.removeItem('token');
    // localStorage.removeItem('user_data');
    // // If using sessionStorage:
    // // sessionStorage.clear();

    // // 2. Redirect to login page
    // this.router.navigate(['/login']);
  //}

  verifyOtp(otp: string): Observable<any> {
    const token = this.storageService.getToken();

    const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
  // Replace with your actual API URL
  return this.http.post(`${AUTH_API}verify-otp/${otp}`, {},{ headers });
}

}
