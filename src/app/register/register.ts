import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../services/auth';
import { Router } from '@angular/router'; // Import Router // Import Storage
import { StorageService } from '../services/storage';
import { SubscriptionsManager } from '../helpers/subscriptionsManager';

@Component({
  selector: 'app-register',
  standalone: true, // Assuming standalone based on your imports
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {

  ngOnInit(): void {
    // this.sub.add = this.authService.register$.subscribe(
    //   (response:any)=> {
    //     console.log('response', response)
    //   }
    // )
  }
  // Update form to match your changePassword endpoint requirements

  sub =  new SubscriptionsManager();


  form: any = {
    currentPassword: '',
    newPassword: '',
    confirmationPassword: ''
  };

  isSuccessful = false;
  isChangeFailed = false;
  errorMessage = '';

  private authService = inject(Auth);
  private router = inject(Router);
  private storageService = inject(StorageService);

  onSubmit(): void {
    const { currentPassword, newPassword, confirmationPassword } = this.form;

    // const reg = {
    //   currentPassword: this.form.currentPassword,
    //   newPassword: this.form.newPassword,
    //   confirmationPassword: this.form.confirmationPassword}


    if (newPassword !== confirmationPassword) {
      this.errorMessage = "Passwords do not match!";
      this.isChangeFailed = true;
      return;
    }

      const reg = {
      currentPassword: this.form.currentPassword,
      newPassword: this.form.newPassword,
      confirmationPassword: this.form.confirmationPassword
    }

    console.log('Sending password change request:', reg);

    this.authService.changePassword(currentPassword, newPassword, confirmationPassword).subscribe({
      next: data => {
        console.log('Password changed successfully:', data);
        this.isSuccessful = true;
        this.isChangeFailed = false;

        // Update the local user object
        const user = this.storageService.getUser();
        if (user && user.user) {
          user.user.passwordExpired = false;
          this.storageService.saveUser(user);
        }

        // Redirect after success
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: err => {
        console.error('Password change failed:', err);
        this.errorMessage = err.error?.message || "Failed to update password. Please check your current password.";
        this.isChangeFailed = true;
      }
    });
  }
}
