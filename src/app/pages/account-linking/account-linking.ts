import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountLinkingService } from '../../services/account-linkingService';
import { CommonModule, Location } from '@angular/common';
import { Auth } from '../../services/auth';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-account-linking',
  imports: [[CommonModule, ReactiveFormsModule]],
  templateUrl: './account-linking.html',
  styleUrl: './account-linking.css',
})
export class AccountLinking  {

  userEmail: string = '';

  linkAccountForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  linkedAccounts: any[] = [];

  // constructor(private posService: PosApplicationServ,
  //   private cdr: ChangeDetectorRef,
  //    private auth: Auth,
  //   private storageService: StorageService ) {}

  constructor(
    private fb: FormBuilder,
    private accountLinkingService: AccountLinkingService,
    private auth: Auth,
    private storageService: StorageService,
    private location: Location
  )

{
    this.linkAccountForm = this.fb.group({
      account: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.userEmail = this.storageService.getUserEmail() || 'Unknown User';
    //this.loadLinkedAccounts();
  }

  /**
   * Load existing linked accounts
   */
  // loadLinkedAccounts(): void {
  //   this.accountLinkingService.getLinkedAccounts().subscribe({
  //     next: (response) => {
  //       if (response.success) {
  //         this.linkedAccounts = response.data || [];
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error loading linked accounts:', error);
  //     }
  //   });
  // }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.linkAccountForm.valid) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';

      const accountValue = this.linkAccountForm.get('account')?.value;

      this.accountLinkingService.linkAccount(accountValue).subscribe({
        next: (response) => {
          this.isLoading = false;

          // Handle the API's response format
          if (response.responseCode === '00' || response.responseCode === '200') {
            this.successMessage = response.responseDescription || 'Account linked successfully!';
            this.linkAccountForm.reset();
          } else {
            this.errorMessage = response.responseDescription || 'Failed to link account';
          }
        },
        error: (error) => {
          this.isLoading = false;

          // Handle 403 Forbidden error specifically
          if (error.status === 403) {
            this.errorMessage = 'Access Forbidden: Invalid or expired token. Please login again.';
            console.error('403 Forbidden - Token issue');
            console.error('Current token:', localStorage.getItem('merchantToken'));
          } else {
            this.errorMessage = error.error?.responseDescription ||
                               error.error?.message ||
                               'An error occurred while linking the account';
          }

          console.error('Full error details:', error);
        }
      });
    } else {
      this.errorMessage = 'Please enter a valid account';
    }
  }

  /**
   * Clear messages
   */
  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  /**
   * Get form control for easy access in template
   */
  get account() {
    return this.linkAccountForm.get('account');
  }

  onLogout() {
    // Optional: Add a confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
    localStorage.clear();
      this.auth.logout();
    }
  }

    goBack(): void {
    // Option 1: Go back to previous page in browser history
    this.location.back();

    // Option 2: Navigate to specific route (e.g., dashboard)
    // this.router.navigate(['/dashboard']);
  }

}
