import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';
import { StorageService } from '../services/storage';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];


  constructor(private authService: Auth, private storageService: StorageService, private router: Router) { }

   ngOnInit(): void {
    // if (this.storageService.isLoggedIn()) {
    //   this.isLoggedIn = true;
    //   this.roles = this.storageService.getUser().roles;
    // }else{
    //   this.isLoggedIn = false;
    // }
  }

  onSubmit(): void {
    const { username, password } = this.form;

  this.authService.login(username, password).subscribe({
    next: (data) => {
      this.storageService.saveUser(data);

      const token = this.storageService.getToken();
      console.log('Token after login:', token);

      this.isLoginFailed = false;
      this.isLoggedIn = true;

      // 1. Check for expired password first
      if (data.user && data.user.passwordExpired === true) {
        this.router.navigate(['/register']);
        return; // Stop execution here
      }

      this.router.navigate(['/verify-otp']);

      // 2. Role-Based Redirection
      // const userRoles = data.user.roles || [];

      // // We extract the 'role' string from the first object in the array
      // const primaryRole = userRoles.length > 0 ? userRoles[0].role : null;

      // switch (primaryRole) {
      //   case 'SOLE_TRADER':
      //     this.router.navigate(['/sole-trader']);
      //     break;
      //   case 'POSMAN':
      //     this.router.navigate(['/posman-dashboard']);
      //     break;
      //   case 'ADMIN':
      //     this.router.navigate(['/admin-panel']);
      //     break;
      //   default:
      //     // Fallback if no specific role matches
      //     this.router.navigate(['/dashboard']);
      //     break;
      // }
    },
    error: (err) => {
      this.errorMessage = err.error.message || 'Login failed';
      this.isLoginFailed = true;
    }
  });


    // this.authService.login(username, password).subscribe({
    //   next: (data) => {
    //     // Save user to storage (includes accessToken and user object)
    //     this.storageService.saveUser(data);

    //     this.isLoginFailed = false;
    //     this.isLoggedIn = true;

    //     // 3. Check if password has expired
    //     if (data.user && data.user.passwordExpired === true) {
    //       // Redirect to the register/change-password page
    //       this.router.navigate(['/register']);
    //     } else {
    //       // Standard redirect to dashboard
    //       this.router.navigate(['/dashboard']);
    //     }
    //   },
    //   error: (err) => {
    //     this.errorMessage = err.error.message;
    //     this.isLoginFailed = true;
    //   }
    // });
  }


    reloadPage(): void {
    window.location.reload();
  }

}
