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
  isLoading = false;


  constructor(private authService: Auth, private storageService: StorageService, private router: Router) { }

   ngOnInit(): void {

  }

  onSubmit(): void {
    const { username, password } = this.form;

  this.authService.login(username, password).subscribe({
    next: (data) => {


      if (data.responseCode) {
          // This is an error response from backend
          this.errorMessage = data.responseDescription || 'Invalid username or password';
          this.isLoginFailed = true;
          this.isLoggedIn = false;
          this.storageService.clean();
          return;
        }

        // Check if response has the expected success structure
        if (!data.accessToken || !data.user) {
          this.errorMessage = 'Invalid response from server';
          this.isLoginFailed = true;
          this.isLoggedIn = false;
          return;
        }

        this.storageService.saveUser(data);

      const token = this.storageService.getToken();
      console.log('Token after login:', token);


      // 1. Check for expired password first
      if (data.user && data.user.passwordExpired === true) {
        this.router.navigate(['/register']);
        return; // Stop execution here
      }

      this.router.navigate(['/verify-otp']);
    },
    error: (err) => {
      console.error('Login error:', err);

        // Handle error response
        this.errorMessage = err.error?.responseDescription ||
                           err.error?.message ||
                           'Invalid username or password';
        this.isLoginFailed = true;
        this.isLoggedIn = false;

        // Clear any stored data
        this.storageService.clean();
    }
  });

  }


    reloadPage(): void {
    window.location.reload();
  }

}
