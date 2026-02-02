// import { PosApplicationServ } from './../../services/pos-applicationServ';
// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Account, Category, MerchantCategoryCode, PosApplicationRequest } from '../../services/application.models';
// import { FormsModule } from '@angular/forms';
// import { forkJoin } from 'rxjs/internal/observable/forkJoin';
// import { catchError, finalize, of, tap } from 'rxjs';

// @Component({
//   selector: 'app-pos-application',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './pos-application.html',
//   styleUrl: './pos-application.css',
// })
// export class PosApplication implements OnInit {

//     posApplicationForm = {
//     remarks: '',
//     requests: [
//       {
//         categoryId: '',
//         tradeName: '',
//         location: '',
//         merchantCategoryCode: '',
//         accountIds: [] as string[],
//         remarks: ''
//       }
//     ]
//   };

//   // Dropdown data
//   accounts: Account[] = [];
//   categories: Category[] = [];
//   merchantCategoryCodes: MerchantCategoryCode[] = [];

//   // UI state
//   isLoading = false;
//   isSubmitting = false;
//   errorMessage = '';
//   successMessage = '';

//   // Validation errors
//   validationErrors: any = {
//     requests: []
//   };

//   constructor(private posService: PosApplicationServ,
//     private cdr: ChangeDetectorRef ) {}

//   ngOnInit(): void {
//     this.loadDropdownData();
//     this.initializeValidationErrors();
//   }

//   /**
//    * Initialize validation errors structure
//    */
//   private initializeValidationErrors(): void {
//     this.validationErrors.requests = this.posApplicationForm.requests.map(() => ({
//       categoryId: '',
//       tradeName: '',
//       location: '',
//       merchantCategoryCode: '',
//       accountIds: ''
//     }));
//   }

// private loadDropdownData(): void {
//   console.log('🔵 STEP 1: Setting isLoading to true');
//   this.isLoading = true;
//   this.errorMessage = '';
//   this.cdr.detectChanges();

//   console.log('🔵 STEP 2: Creating observables');

//   const accounts$ = this.posService.getAccounts().pipe(
//     tap(data => console.log('✅ Accounts received:', data)),
//     catchError(err => {
//       console.error('❌ Accounts error:', err);
//       return of([] as Account[]);
//     })
//   );

//   const categories$ = this.posService.getCategories().pipe(
//     tap(data => console.log('✅ Categories received:', data)),
//     catchError(err => {
//       console.error('❌ Categories error:', err);
//       return of([] as Category[]);
//     })
//   );

//   const mccs$ = this.posService.getMerchantCategoryCodes().pipe(
//     tap(data => console.log('✅ MCCs received:', data)),
//     catchError(err => {
//       console.error('❌ MCCs error:', err);
//       return of([] as MerchantCategoryCode[]);
//     })
//   );

//   console.log('🔵 STEP 3: Starting forkJoin');

//   forkJoin({
//     accounts: accounts$,
//     categories: categories$,
//     mccs: mccs$
//   })
//   .pipe(
//     tap(() => console.log('🟡 ForkJoin emitted, about to finalize')),
//     finalize(() => {
//       console.log('🟢 FINALIZE CALLED - Setting isLoading to FALSE');
//       this.isLoading = false;
//       this.cdr.detectChanges();
//     })
//   )
//   .subscribe({
//     next: (result: { accounts: Account[], categories: Category[], mccs: MerchantCategoryCode[] }) => {
//       console.log('🟢 SUBSCRIBE NEXT called with result:', result);
//       this.accounts = result.accounts;
//       this.categories = result.categories;
//       this.merchantCategoryCodes = result.mccs;
//       console.log('🟢 Data assigned to component properties');
//       console.log('   - Accounts:', this.accounts.length);
//       console.log('   - Categories:', this.categories.length);
//       console.log('   - MCCs:', this.merchantCategoryCodes.length);
//       this.cdr.detectChanges();
//     },
//     error: (error) => {
//       console.error('🔴 SUBSCRIBE ERROR called:', error);
//       this.errorMessage = 'Could not load form data.';
//       this.cdr.detectChanges();
//     },
//     complete: () => {
//       console.log('🟢 SUBSCRIBE COMPLETE called');
//     }
//   });

//   console.log('🔵 STEP 4: Subscribe method called, waiting for responses...');
// }

//   /**
//    * Add a new request to the form
//    */
//   addRequest(): void {
//     this.posApplicationForm.requests.push({
//       categoryId: '',
//       tradeName: '',
//       location: '',
//       merchantCategoryCode: '',
//       accountIds: [],
//       remarks: ''
//     });

//     // Add validation errors for new request
//     this.validationErrors.requests.push({
//       categoryId: '',
//       tradeName: '',
//       location: '',
//       merchantCategoryCode: '',
//       accountIds: ''
//     });
//   }

//   /**
//    * Remove a request from the form
//    */
//   removeRequest(index: number): void {
//     if (this.posApplicationForm.requests.length > 1) {
//       this.posApplicationForm.requests.splice(index, 1);
//       this.validationErrors.requests.splice(index, 1);
//     }
//   }

//   /**
//    * Get selected category object by ID
//    */
//   getSelectedCategory(categoryId: string): Category | undefined {
//     return this.categories.find(cat => cat.id === categoryId);
//   }

//   /**
//    * Get selected accounts by IDs
//    */
//   getSelectedAccounts(accountIds: string[]): Account[] {
//     return this.accounts.filter(acc => accountIds.includes(acc.id));
//   }

//   onSubmit(): void {
//     // Validate form


//   console.log('Form data being submitted:', JSON.stringify(this.posApplicationForm, null, 2));
//   // ... rest of your submit code
//     if (!this.validateForm()) {
//       this.errorMessage = 'Please fill in all required fields.';
//       return;
//     }

//     this.isSubmitting = true;
//     this.errorMessage = '';
//     this.successMessage = '';

//     const application: PosApplicationRequest = {
//   remarks: this.posApplicationForm.remarks || '', // Ensure not null
//   requests: this.posApplicationForm.requests.map((request) => {
//     const selectedCategory = this.getSelectedCategory(request.categoryId);
//     const selectedAccounts = this.getSelectedAccounts(request.accountIds);

//     return {
//       // Omit 'id' and 'approvedAt' here if this is a NEW application
//       category: {
//         id: selectedCategory?.id || '',
//         name: selectedCategory?.name || '',
//         description: selectedCategory?.description || ''
//       },
//       tradeName: request.tradeName,
//       location: request.location,
//       merchantCategoryCode: request.merchantCategoryCode,
//       account: selectedAccounts, // Full objects as requested
//       status: 'PENDING',
//       remarks: request.remarks || ''
//     };
//   })
// };


//     console.log('Submitting POS application:', application);

//     // Submit to API
//     this.posService.submitPosApplication(application).subscribe({
//       next: (response) => {
//         console.log('Application submitted successfully:', response);
//         this.successMessage = 'POS application submitted successfully!';
//         this.isSubmitting = false;

//         // Reset form after successful submission
//         setTimeout(() => {
//           this.resetForm();
//           this.successMessage = '';
//         }, 3000);
//       },
//       error: (error) => {
//         console.error('Failed to submit application:', error);
//         this.errorMessage = error.error?.message || 'Failed to submit application. Please try again.';
//         this.isSubmitting = false;
//       }
//     });
//   }

//   /**
//    * Reset the form to initial state
//    */
//   resetForm(): void {
//     this.posApplicationForm = {
//       remarks: '',
//       requests: [
//         {
//           categoryId: '',
//           tradeName: '',
//           location: '',
//           merchantCategoryCode: '',
//           accountIds: [],
//           remarks: ''
//         }
//       ]
//     };

//     this.initializeValidationErrors();
//     this.errorMessage = '';
//     this.successMessage = '';
//   }

//   /**
//    * Handle account selection change (for multi-select)
//    */
//   onAccountSelectionChange(event: any, requestIndex: number): void {
//     const selectedOptions = Array.from(event.target.selectedOptions)
//       .map((option: any) => option.value);

//     this.posApplicationForm.requests[requestIndex].accountIds = selectedOptions;
//   }

//   /**
//    * Check if a specific field has an error
//    */
//   hasError(field: string, requestIndex: number): boolean {
//     return this.validationErrors.requests[requestIndex] &&
//            this.validationErrors.requests[requestIndex][field] !== '';
//   }

//   /**
//    * Get error message for a specific field
//    */
//   getErrorMessage(field: string, requestIndex: number): string {
//     return this.validationErrors.requests[requestIndex]?.[field] || '';
//   }


// getFilteredAccounts(requestIndex: number, currency?: 'ZWG' | 'USD'): Account[] {
//   const request = this.posApplicationForm.requests[requestIndex];
//   const selectedCategory = this.getSelectedCategory(request.categoryId);

//   if (!selectedCategory) {
//     return this.accounts;
//   }

//   const categoryName = selectedCategory.name.toUpperCase();

//   // If currency is specified (for multicurrency second field), filter by that currency
//   if (currency) {
//     return this.accounts.filter(acc => acc.currency === currency);
//   }

//   // For ZWG_STANDALONE, show only ZWG accounts
//   if (categoryName === 'ZWG_STANDALONE') {
//     return this.accounts.filter(acc => acc.currency === 'ZWG');
//   }

//   // For USD_STANDALONE, show only USD accounts
//   if (categoryName === 'USD_STANDALONE') {
//     return this.accounts.filter(acc => acc.currency === 'USD');
//   }

//   // For MULTICURRENCY categories, this will be handled by separate dropdowns
//   if (categoryName.includes('MULTICURRENCY')) {
//     // Return empty for the main dropdown, we'll use separate ZWG/USD dropdowns
//     return [];
//   }

//   // Default: show all accounts
//   return this.accounts;
// }

// /**
//  * Check if category requires multicurrency accounts
//  */
// isMulticurrencyCategory(requestIndex: number): boolean {
//   const request = this.posApplicationForm.requests[requestIndex];
//   const selectedCategory = this.getSelectedCategory(request.categoryId);

//   if (!selectedCategory) {
//     return false;
//   }

//   return selectedCategory.name.toUpperCase().includes('MULTICURRENCY');
// }

// /**
//  * Check if category is standalone (single currency)
//  */
// isStandaloneCategory(requestIndex: number): boolean {
//   const request = this.posApplicationForm.requests[requestIndex];
//   const selectedCategory = this.getSelectedCategory(request.categoryId);

//   if (!selectedCategory) {
//     return false;
//   }

//   const categoryName = selectedCategory.name.toUpperCase();
//   return categoryName === 'ZWG_STANDALONE' || categoryName === 'USD_STANDALONE';
// }

// /**
//  * Handle category change - reset account selections
//  */
// onCategoryChange(requestIndex: number): void {
//   // Clear account selections when category changes
//   this.posApplicationForm.requests[requestIndex].accountIds = [];

//   // Clear any validation errors for accounts
//   if (this.validationErrors.requests[requestIndex]) {
//     this.validationErrors.requests[requestIndex].accountIds = '';
//   }
// }

// /**
//  * Handle single account selection (for standalone categories)
//  */
// onSingleAccountSelect(event: any, requestIndex: number): void {
//   const selectedAccountId = event.target.value;

//   if (selectedAccountId) {
//     this.posApplicationForm.requests[requestIndex].accountIds = [selectedAccountId];
//   } else {
//     this.posApplicationForm.requests[requestIndex].accountIds = [];
//   }
// }

// /**
//  * Handle ZWG account selection for multicurrency
//  */
// onZwgAccountSelect(event: any, requestIndex: number): void {
//   const selectedAccountId = event.target.value;
//   const accountIds = this.posApplicationForm.requests[requestIndex].accountIds;

//   // Remove any existing ZWG account
//   const filtered = accountIds.filter(id => {
//     const account = this.accounts.find(acc => acc.id === id);
//     return account && account.currency !== 'ZWG';
//   });

//   // Add new ZWG account if selected
//   if (selectedAccountId) {
//     filtered.unshift(selectedAccountId); // Add at beginning
//   }

//   this.posApplicationForm.requests[requestIndex].accountIds = filtered;
// }

// /**
//  * Handle USD account selection for multicurrency
//  */
// onUsdAccountSelect(event: any, requestIndex: number): void {
//   const selectedAccountId = event.target.value;
//   const accountIds = this.posApplicationForm.requests[requestIndex].accountIds;

//   // Remove any existing USD account
//   const filtered = accountIds.filter(id => {
//     const account = this.accounts.find(acc => acc.id === id);
//     return account && account.currency !== 'USD';
//   });

//   // Add new USD account if selected
//   if (selectedAccountId) {
//     filtered.push(selectedAccountId); // Add at end
//   }

//   this.posApplicationForm.requests[requestIndex].accountIds = filtered;
// }

// /**
//  * Get selected ZWG account ID for a request
//  */
// getSelectedZwgAccountId(requestIndex: number): string {
//   const accountIds = this.posApplicationForm.requests[requestIndex].accountIds;
//   const zwgAccount = accountIds.find(id => {
//     const account = this.accounts.find(acc => acc.id === id);
//     return account && account.currency === 'ZWG';
//   });
//   return zwgAccount || '';
// }

// /**
//  * Get selected USD account ID for a request
//  */
// getSelectedUsdAccountId(requestIndex: number): string {
//   const accountIds = this.posApplicationForm.requests[requestIndex].accountIds;
//   const usdAccount = accountIds.find(id => {
//     const account = this.accounts.find(acc => acc.id === id);
//     return account && account.currency === 'USD';
//   });
//   return usdAccount || '';
// }

// /**
//  * Enhanced validation to check multicurrency requirements
//  */
// private validateForm(): boolean {
//   let isValid = true;

//   // Reset all errors
//   this.validationErrors.requests = this.posApplicationForm.requests.map(() => ({
//     categoryId: '',
//     tradeName: '',
//     location: '',
//     merchantCategoryCode: '',
//     accountIds: ''
//   }));

//   // Validate each request
//   this.posApplicationForm.requests.forEach((request, index) => {
//     // Validate trade name
//     if (!request.tradeName || request.tradeName.trim() === '') {
//       this.validationErrors.requests[index].tradeName = 'Trade name is required';
//       isValid = false;
//     }

//     // Validate location
//     if (!request.location || request.location.trim() === '') {
//       this.validationErrors.requests[index].location = 'Location is required';
//       isValid = false;
//     }

//     // Validate category
//     if (!request.categoryId || request.categoryId === '') {
//       this.validationErrors.requests[index].categoryId = 'Category is required';
//       isValid = false;
//     }

//     // Validate merchant category code
//     if (!request.merchantCategoryCode || request.merchantCategoryCode === '') {
//       this.validationErrors.requests[index].merchantCategoryCode = 'Merchant Category Code is required';
//       isValid = false;
//     }

//     // Enhanced account validation based on category
//     const selectedCategory = this.getSelectedCategory(request.categoryId);

//     if (selectedCategory) {
//       const categoryName = selectedCategory.name.toUpperCase();

//       if (categoryName.includes('MULTICURRENCY')) {
//         // For multicurrency, need both ZWG and USD accounts
//         const hasZwgAccount = request.accountIds.some(id => {
//           const account = this.accounts.find(acc => acc.id === id);
//           return account && account.currency === 'ZWG';
//         });

//         const hasUsdAccount = request.accountIds.some(id => {
//           const account = this.accounts.find(acc => acc.id === id);
//           return account && account.currency === 'USD';
//         });

//         if (!hasZwgAccount || !hasUsdAccount) {
//           this.validationErrors.requests[index].accountIds =
//             'Both ZWG and USD accounts are required for multicurrency category';
//           isValid = false;
//         }
//       } else {
//         // For standalone categories, need at least one account
//         if (!request.accountIds || request.accountIds.length === 0) {
//           this.validationErrors.requests[index].accountIds = 'At least one account is required';
//           isValid = false;
//         }
//       }
//     } else {
//       // No category selected, still check for accounts
//       if (!request.accountIds || request.accountIds.length === 0) {
//         this.validationErrors.requests[index].accountIds = 'At least one account is required';
//         isValid = false;
//       }
//     }
//   });

//   return isValid;
// }

// }



import { PosApplicationServ } from './../../services/pos-applicationServ';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account, Category, MerchantCategoryCode, PosApplicationRequest } from '../../services/application.models';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { catchError, finalize, of, tap } from 'rxjs';
import { Auth } from '../../services/auth';
import { Location } from '@angular/common';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-pos-application',
  imports: [CommonModule, FormsModule],
  templateUrl:'./pos-application.html',
  styleUrl: './pos-application.css',
})
export class PosApplication implements OnInit {

   userEmail: string = '';

    posApplicationForm = {
    remarks: '',
    requests: [
      {
        categoryId: '',
        tradeName: '',
        location: '',
        merchantCategoryCode: '',
        accountIds: [] as string[],
        remarks: ''
      }
    ]
  };

  // Dropdown data
  accounts: Account[] = [];
  categories: Category[] = [];
  merchantCategoryCodes: MerchantCategoryCode[] = [];

  // UI state
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  // Validation errors
  validationErrors: any = {
    requests: []
  };

  constructor(private posService: PosApplicationServ,
    private cdr: ChangeDetectorRef,
     private auth: Auth,
    private storageService: StorageService,
  private location: Location ) {}

  ngOnInit(): void {
    this.loadDropdownData();
    this.initializeValidationErrors();
    this.userEmail = this.storageService.getUserEmail() || 'Unknown User';
  }

  /**
   * Initialize validation errors structure
   */
  private initializeValidationErrors(): void {
    this.validationErrors.requests = this.posApplicationForm.requests.map(() => ({
      categoryId: '',
      tradeName: '',
      location: '',
      merchantCategoryCode: '',
      accountIds: ''
    }));
  }

  private loadDropdownData(): void {
    console.log('🔵 STEP 1: Setting isLoading to true');
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    console.log('🔵 STEP 2: Creating observables');

    const accounts$ = this.posService.getAccounts().pipe(
      tap(data => console.log('✅ Accounts received:', data)),
      catchError(err => {
        console.error('❌ Accounts error:', err);
        return of([] as Account[]);
      })
    );

    const categories$ = this.posService.getCategories().pipe(
      tap(data => console.log('✅ Categories received:', data)),
      catchError(err => {
        console.error('❌ Categories error:', err);
        return of([] as Category[]);
      })
    );

    const mccs$ = this.posService.getMerchantCategoryCodes().pipe(
      tap(data => console.log('✅ MCCs received:', data)),
      catchError(err => {
        console.error('❌ MCCs error:', err);
        return of([] as MerchantCategoryCode[]);
      })
    );

    console.log('🔵 STEP 3: Starting forkJoin');

    forkJoin({
      accounts: accounts$,
      categories: categories$,
      mccs: mccs$
    })
    .pipe(
      tap(() => console.log('🟡 ForkJoin emitted, about to finalize')),
      finalize(() => {
        console.log('🟢 FINALIZE CALLED - Setting isLoading to FALSE');
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    )
    .subscribe({
      next: (result: { accounts: Account[], categories: Category[], mccs: MerchantCategoryCode[] }) => {
        console.log('🟢 SUBSCRIBE NEXT called with result:', result);
        this.accounts = result.accounts;
        this.categories = result.categories;
        this.merchantCategoryCodes = result.mccs;
        console.log('🟢 Data assigned to component properties');
        console.log('   - Accounts:', this.accounts.length);
        console.log('   - Categories:', this.categories.length);
        console.log('   - MCCs:', this.merchantCategoryCodes.length);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('🔴 SUBSCRIBE ERROR called:', error);
        this.errorMessage = 'Could not load form data.';
        this.cdr.detectChanges();
      },
      complete: () => {
        console.log('🟢 SUBSCRIBE COMPLETE called');
      }
    });

    console.log('🔵 STEP 4: Subscribe method called, waiting for responses...');
  }

  /**
   * Add a new request to the form
   */
  addRequest(): void {
    this.posApplicationForm.requests.push({
      categoryId: '',
      tradeName: '',
      location: '',
      merchantCategoryCode: '',
      accountIds: [],
      remarks: ''
    });

    // Add validation errors for new request
    this.validationErrors.requests.push({
      categoryId: '',
      tradeName: '',
      location: '',
      merchantCategoryCode: '',
      accountIds: ''
    });
  }

  /**
   * Remove a request from the form
   */
  removeRequest(index: number): void {
    if (this.posApplicationForm.requests.length > 1) {
      this.posApplicationForm.requests.splice(index, 1);
      this.validationErrors.requests.splice(index, 1);
    }
  }

  /**
   * Get selected category object by ID
   */
  getSelectedCategory(categoryId: string): Category | undefined {
    return this.categories.find(cat => cat.id === categoryId);
  }

  /**
   * Get selected accounts by IDs
   */
  getSelectedAccounts(accountIds: string[]): Account[] {
    return this.accounts.filter(acc => accountIds.includes(acc.id));
  }

  /**
   * Handle form submission
   */

  //current
  onSubmit(): void {
    console.log('📋 RAW Form data:', JSON.stringify(this.posApplicationForm, null, 2));

    // Validate form
    if (!this.validateForm()) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Build the application request with CORRECT structure
    const application: PosApplicationRequest = {
      remarks: this.posApplicationForm.remarks || '',
      requests: this.posApplicationForm.requests.map((request) => {
        const selectedCategory = this.getSelectedCategory(request.categoryId);
        const selectedAccounts = this.getSelectedAccounts(request.accountIds);

        console.log(` Processing request for ${request.tradeName}:`);
        console.log('  - Selected Category:', selectedCategory);
        console.log('  - Selected Accounts:', selectedAccounts);
        console.log('  - Account IDs:', request.accountIds);

        // Create the request object
        const posRequest = {
          category: {
            id: selectedCategory?.id || '',
            name: selectedCategory?.name || '',
            description: selectedCategory?.description || ''
          },
          tradeName: request.tradeName,
          location: request.location,
          merchantCategoryCode: request.merchantCategoryCode,
          account: selectedAccounts, // Array of full Account objects
          status: 'PENDING' as const,
          remarks: request.remarks || ''
        };

        console.log('🔍 Individual request object:', posRequest);
        console.log('🔍 Individual request JSON:', JSON.stringify(posRequest, null, 2));

        return posRequest;
      })
    };

    //console.log('✅ Final payload structure (object):');
    console.log(application);
    console.log('Final payload structure (JSON):');
    console.log(JSON.stringify(application, null, 2));

    console.log('Payload breakdown:');
    console.log('  - Total requests:', application.requests.length);
    application.requests.forEach((req, idx) => {
      console.log(`  - Request ${idx + 1}:`);
      console.log(`    • Trade Name: ${req.tradeName}`);
      console.log(`    • Location: ${req.location}`);
      console.log(`    • Category: ${req.category.name}`);
      console.log(`    • MCC: ${req.merchantCategoryCode}`);
      console.log(`    • Accounts (${req.account.length}):`, req.account.map(a => `${a.accountNumber} (${a.currency})`));
      console.log(`    • Status: ${req.status}`);
    });

    // CRITICAL: Verify the structure one more time
    console.log('FINAL CHECK - What keys exist at request level?');
    console.log('Keys:', Object.keys(application.requests[0]));
    console.log('Expected: ["category", "tradeName", "location", "merchantCategoryCode", "account", "status", "remarks"]');

    // Submit to API
    this.posService.submitPosApplication(application).subscribe({
      next: (response) => {
        console.log('✅ Application submitted successfully:', response);
        this.successMessage = 'POS application submitted successfully!';
        this.isSubmitting = false;

        // Reset form after successful submission
        setTimeout(() => {
          this.resetForm();
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('❌ Failed to submit application:', error);
        console.error('❌ Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.error?.message,
          fullError: error
        });
        this.errorMessage = error.error?.message || 'Failed to submit application. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  /**
   * Reset the form to initial state
   */
  resetForm(): void {
    this.posApplicationForm = {
      remarks: '',
      requests: [
        {
          categoryId: '',
          tradeName: '',
          location: '',
          merchantCategoryCode: '',
          accountIds: [],
          remarks: ''
        }
      ]
    };

    this.initializeValidationErrors();
    this.errorMessage = '';
    this.successMessage = '';
  }

  /**
   * Handle account selection change (for multi-select)
   */
  onAccountSelectionChange(event: any, requestIndex: number): void {
    const selectedOptions = Array.from(event.target.selectedOptions)
      .map((option: any) => option.value);

    this.posApplicationForm.requests[requestIndex].accountIds = selectedOptions;
  }

  /**
   * Check if a specific field has an error
   */
  hasError(field: string, requestIndex: number): boolean {
    return this.validationErrors.requests[requestIndex] &&
           this.validationErrors.requests[requestIndex][field] !== '';
  }

  /**
   * Get error message for a specific field
   */
  getErrorMessage(field: string, requestIndex: number): string {
    return this.validationErrors.requests[requestIndex]?.[field] || '';
  }

  getFilteredAccounts(requestIndex: number, currency?: 'ZWG' | 'USD'): Account[] {
    const request = this.posApplicationForm.requests[requestIndex];
    const selectedCategory = this.getSelectedCategory(request.categoryId);

    if (!selectedCategory) {
      return this.accounts;
    }

    const categoryName = selectedCategory.name.toUpperCase();

    // If currency is specified (for multicurrency second field), filter by that currency
    if (currency) {
      return this.accounts.filter(acc => acc.currency === currency);
    }

    // For ZWG_STANDALONE, show only ZWG accounts
    if (categoryName === 'ZWG_STANDALONE') {
      return this.accounts.filter(acc => acc.currency === 'ZWG');
    }

    // For USD_STANDALONE, show only USD accounts
    if (categoryName === 'USD_STANDALONE') {
      return this.accounts.filter(acc => acc.currency === 'USD');
    }

    // For MULTICURRENCY categories, this will be handled by separate dropdowns
    if (categoryName.includes('MULTICURRENCY')) {
      // Return empty for the main dropdown, we'll use separate ZWG/USD dropdowns
      return [];
    }

    // Default: show all accounts
    return this.accounts;
  }

  /**
   * Check if category requires multicurrency accounts
   */
  isMulticurrencyCategory(requestIndex: number): boolean {
    const request = this.posApplicationForm.requests[requestIndex];
    const selectedCategory = this.getSelectedCategory(request.categoryId);

    if (!selectedCategory) {
      return false;
    }

    return selectedCategory.name.toUpperCase().includes('MULTICURRENCY');
  }

  /**
   * Check if category is standalone (single currency)
   */
  isStandaloneCategory(requestIndex: number): boolean {
    const request = this.posApplicationForm.requests[requestIndex];
    const selectedCategory = this.getSelectedCategory(request.categoryId);

    if (!selectedCategory) {
      return false;
    }

    const categoryName = selectedCategory.name.toUpperCase();
    return categoryName === 'ZWG_STANDALONE' || categoryName === 'USD_STANDALONE';
  }

  /**
   * Handle category change - reset account selections
   */
  onCategoryChange(requestIndex: number): void {
    // Clear account selections when category changes
    this.posApplicationForm.requests[requestIndex].accountIds = [];

    // Clear any validation errors for accounts
    if (this.validationErrors.requests[requestIndex]) {
      this.validationErrors.requests[requestIndex].accountIds = '';
    }
  }

  /**
   * Handle single account selection (for standalone categories)
   */
  onSingleAccountSelect(event: any, requestIndex: number): void {
    const selectedAccountId = event.target.value;

    if (selectedAccountId) {
      this.posApplicationForm.requests[requestIndex].accountIds = [selectedAccountId];
    } else {
      this.posApplicationForm.requests[requestIndex].accountIds = [];
    }
  }

  /**
   * Handle ZWG account selection for multicurrency
   */
  onZwgAccountSelect(event: any, requestIndex: number): void {
    const selectedAccountId = event.target.value;
    const accountIds = this.posApplicationForm.requests[requestIndex].accountIds;

    // Remove any existing ZWG account
    const filtered = accountIds.filter(id => {
      const account = this.accounts.find(acc => acc.id === id);
      return account && account.currency !== 'ZWG';
    });

    // Add new ZWG account if selected
    if (selectedAccountId) {
      filtered.unshift(selectedAccountId); // Add at beginning
    }

    this.posApplicationForm.requests[requestIndex].accountIds = filtered;
  }

  /**
   * Handle USD account selection for multicurrency
   */
  onUsdAccountSelect(event: any, requestIndex: number): void {
    const selectedAccountId = event.target.value;
    const accountIds = this.posApplicationForm.requests[requestIndex].accountIds;

    // Remove any existing USD account
    const filtered = accountIds.filter(id => {
      const account = this.accounts.find(acc => acc.id === id);
      return account && account.currency !== 'USD';
    });

    // Add new USD account if selected
    if (selectedAccountId) {
      filtered.push(selectedAccountId); // Add at end
    }

    this.posApplicationForm.requests[requestIndex].accountIds = filtered;
  }

  /**
   * Get selected ZWG account ID for a request
   */
  getSelectedZwgAccountId(requestIndex: number): string {
    const accountIds = this.posApplicationForm.requests[requestIndex].accountIds;
    const zwgAccount = accountIds.find(id => {
      const account = this.accounts.find(acc => acc.id === id);
      return account && account.currency === 'ZWG';
    });
    return zwgAccount || '';
  }

  /**
   * Get selected USD account ID for a request
   */
  getSelectedUsdAccountId(requestIndex: number): string {
    const accountIds = this.posApplicationForm.requests[requestIndex].accountIds;
    const usdAccount = accountIds.find(id => {
      const account = this.accounts.find(acc => acc.id === id);
      return account && account.currency === 'USD';
    });
    return usdAccount || '';
  }

  /**
   * Enhanced validation to check multicurrency requirements
   */
  private validateForm(): boolean {
    let isValid = true;

    // Reset all errors
    this.validationErrors.requests = this.posApplicationForm.requests.map(() => ({
      categoryId: '',
      tradeName: '',
      location: '',
      merchantCategoryCode: '',
      accountIds: ''
    }));

    // Validate each request
    this.posApplicationForm.requests.forEach((request, index) => {
      // Validate trade name
      if (!request.tradeName || request.tradeName.trim() === '') {
        this.validationErrors.requests[index].tradeName = 'Trade name is required';
        isValid = false;
      }

      // Validate location
      if (!request.location || request.location.trim() === '') {
        this.validationErrors.requests[index].location = 'Location is required';
        isValid = false;
      }

      // Validate category
      if (!request.categoryId || request.categoryId === '') {
        this.validationErrors.requests[index].categoryId = 'Category is required';
        isValid = false;
      }

      // Validate merchant category code
      if (!request.merchantCategoryCode || request.merchantCategoryCode === '') {
        this.validationErrors.requests[index].merchantCategoryCode = 'Merchant Category Code is required';
        isValid = false;
      }

      // Enhanced account validation based on category
      const selectedCategory = this.getSelectedCategory(request.categoryId);

      if (selectedCategory) {
        const categoryName = selectedCategory.name.toUpperCase();

        if (categoryName.includes('MULTICURRENCY')) {
          // For multicurrency, need both ZWG and USD accounts
          const hasZwgAccount = request.accountIds.some(id => {
            const account = this.accounts.find(acc => acc.id === id);
            return account && account.currency === 'ZWG';
          });

          const hasUsdAccount = request.accountIds.some(id => {
            const account = this.accounts.find(acc => acc.id === id);
            return account && account.currency === 'USD';
          });

          if (!hasZwgAccount || !hasUsdAccount) {
            this.validationErrors.requests[index].accountIds =
              'Both ZWG and USD accounts are required for multicurrency category';
            isValid = false;
          }
        } else {
          // For standalone categories, need at least one account
          if (!request.accountIds || request.accountIds.length === 0) {
            this.validationErrors.requests[index].accountIds = 'At least one account is required';
            isValid = false;
          }
        }
      } else {
        // No category selected, still check for accounts
        if (!request.accountIds || request.accountIds.length === 0) {
          this.validationErrors.requests[index].accountIds = 'At least one account is required';
          isValid = false;
        }
      }
    });

    return isValid;
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
