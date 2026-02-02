import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-otp-verification',
  imports: [CommonModule, FormsModule],
  templateUrl: './otp-verification.html',
  styleUrl: './otp-verification.css',
})
export class OtpVerification {
  otpValue: string = '';
  errorMessage: string = '';

  constructor(private authService: Auth,
     private router: Router,
      private storageService: StorageService) {}

  verify(): void {
    this.authService.verifyOtp(this.otpValue).subscribe({
      next: (response) => {

        if (response?.responseCode === '006') {
        this.errorMessage = response.responseDescription || "Invalid OTP or OTP has expired";
        return; // Stop execution here
      }

      this.storageService.setOtpVerified(true);

      this.router.navigate(['/merchant-overview'],  { replaceUrl: true });

      // const storedData = this.storageService.getUser();

      // const user = storedData?.user ? storedData.user : storedData;

      // const roles = user?.roles || [];

      // const primaryRole = roles.length > 0 ? roles[0].role : null;

      // NOW we redirect
      // switch (primaryRole) {
      //   case 'SOLE_TRADER':
      //     this.router.navigate(['/account-linking']);
      //     break;
      //   case 'POSMAN':
      //     this.router.navigate(['/posman-dashboard']);
      //     break;
      //   default:
      //     this.router.navigate(['/dashboard']);
      //     break;
      // }
      },
      // error: (err) => {
      //   if (err?.error?.responseCode === '006') {
      //   this.errorMessage = err.error.responseDescription || "Invalid OTP or OTP has expired";
      // } else {
      //   this.errorMessage = "An error occurred. Please try again.";
      // }
      // }
    });
  }

  clearError(): void {
  this.errorMessage = '';
}
}
