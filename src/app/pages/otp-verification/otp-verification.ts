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
      },
    });
  }

  clearError(): void {
  this.errorMessage = '';
}
}
