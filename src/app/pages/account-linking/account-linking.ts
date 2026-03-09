import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountLinkingService } from '../../services/account-linkingService';
import { CommonModule, Location } from '@angular/common';
import { Auth } from '../../services/auth';
import { StorageService } from '../../services/storage';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-account-linking',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-linking.html',
  styleUrl: './account-linking.css',
})
export class AccountLinking implements OnInit, OnDestroy {

  userEmail: string = '';

  linkAccountForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  linkedAccounts: any[] = [];
  isLoadingAccounts = false;
  private destroy$ = new Subject<void>();


  constructor(
    private fb: FormBuilder,
    private accountLinkingService: AccountLinkingService,
    private auth: Auth,
    private storageService: StorageService,
    private location: Location,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.linkAccountForm = this.fb.group({
      account: ['', [Validators.required, Validators.minLength(3)]]
    });

    // Subscribe to router events to detect navigation to this component
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      // Reload accounts whenever navigation completes
      console.log('Navigation detected, reloading accounts...');
      this.loadLinkedAccounts();
    });
  }

  ngOnInit(): void {
    console.log('ngOnInit - Component initialized');
    this.userEmail = this.storageService.getUserEmail() || 'Unknown User';
    this.loadLinkedAccounts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLinkedAccounts(): void {
    console.log('loadLinkedAccounts - Starting to load accounts');
    this.isLoadingAccounts = true;
    this.cdr.detectChanges();

    this.accountLinkingService.getLinkedAccounts().subscribe({
      next: (response) => {
        console.log('API Response:', response);
        if (response.responseCode === '000' || response.responseCode === '00' || response.responseCode === '200') {
          this.linkedAccounts = response.data || [];
          console.log('Linked Accounts:', this.linkedAccounts);
          console.log('Number of accounts:', this.linkedAccounts.length);
        } else {
          this.errorMessage = response.responseDescription || 'Failed to load linked accounts';
          console.error('API returned error:', this.errorMessage);
        }
        this.isLoadingAccounts = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading linked accounts:', error);
        this.errorMessage = 'Failed to load linked accounts. Please try again.';
        this.isLoadingAccounts = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (this.linkAccountForm.valid) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';

      this.cdr.detectChanges();

      const accountValue = this.linkAccountForm.get('account')?.value;

      this.accountLinkingService.linkAccount(accountValue).subscribe({
        next: (response) => {
          this.isLoading = false;

          if (response.responseCode === '00' || response.responseCode === '000' || response.responseCode === '200') {
            this.successMessage = response.responseDescription || 'Account linked successfully!';
            this.linkAccountForm.reset();
            // Reload accounts after successful linking
            this.loadLinkedAccounts();
          } else {
            this.errorMessage = response.responseDescription || 'Failed to link account';
          }

          this.cdr.detectChanges();
        },
        error: (error) => {
          this.isLoading = false;

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
          this.cdr.detectChanges();
        }
      });
    } else {
      this.errorMessage = 'Please enter a valid account';
      this.cdr.detectChanges();
    }
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  get account() {
    return this.linkAccountForm.get('account');
  }

  onLogout() {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.clear();
      this.auth.logout();
    }
  }

  goBack(): void {
    this.location.back();
  }
}
