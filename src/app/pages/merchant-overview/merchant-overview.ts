import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../../services/storage';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-merchant-overview',
  imports: [CommonModule, RouterModule],
  templateUrl: './merchant-overview.html',
  styleUrl: './merchant-overview.css',
})
export class MerchantOverview implements OnInit {

  // canLinkAccount: boolean = false;
  // canApplyPos: boolean = false;

  // constructor(private storageService: StorageService) {}

  // ngOnInit(): void {

  //   this.checkRoles();
  //   // const user = this.storageService.getUser();
  //   // const roles = user?.roles || [];

  //   // // Extract role strings for easy checking
  //   // const roleNames = roles.map((r: any) => r.role);

  //   // // Business Logic: Only SOLE_TRADER can link accounts
  //   // this.canLinkAccount = roleNames.includes('SOLE_TRADER');

  //   // // Business Logic: Everyone (or specific roles) can apply for POS
  //   // this.canApplyPos = true;
  // }

  // private checkRoles(): void {
  //   const user = this.storageService.getUser();

  //   // Safety check: if user or roles are missing, default to false
  //   const roles = user?.roles || [];

  //   // Extract role names into a simple array of strings
  //   const roleNames = roles.map((r: any) => r.role);

  //   // 2. Assign values based on your business logic
  //   //this.canLinkAccount = roleNames.includes('SOLE_TRADER');

  //   this.canApplyPos = roleNames.some((role: string) =>
  //       ['SOLE_TRADER', 'POSMAN', 'MERCHANT_ADMIN'].includes(role)
  //   );

  //   // Assuming everyone can see the POS application
  //   // this.canApplyPos = true;
  //   this.canLinkAccount = roleNames.includes('SOLE_TRADER');

  //   console.log('Access rights:', {
  //     link: this.canLinkAccount,
  //     pos: this.canApplyPos
  //   });
  // }

  canLinkAccount: boolean = false;
  canApplyPos: boolean = false;
  userEmail: string = '';

  constructor(private storageService: StorageService, private router: Router) {}

  ngOnInit(): void {
    this.checkRoles();

    const user = this.storageService.getUser();
  console.log('User object:', user);
  console.log('User email:', this.storageService.getUserEmail());

    this.userEmail = this.storageService.getUserEmail() || 'Unknown User';
    console.log('Final userEmail:', this.userEmail);
  }

  private checkRoles(): void {
    // 1. Get data from storage
    const storedData = this.storageService.getUser();

    // 2. Logic to handle both nested and un-nested responses
    // If storedData has a .user property, use it. Otherwise, use storedData itself.
    const user = storedData?.user ? storedData.user : storedData;

    // 3. Extract the roles array
    const roles = user?.roles || [];

    // 4. Map the role strings (matching your JSON key "role")
    const roleNames: string[] = roles.map((r: any) => r.role);

    // 5. Apply Business Rules
    // Check if user has at least one of the allowed roles for POS
    this.canApplyPos = roleNames.some((role: string) =>
        ['SOLE_TRADER', 'POSMAN', 'MERCHANT_ADMIN'].includes(role)
    );

    // Only SOLE_TRADER can see the Account Linking card
    this.canLinkAccount = roleNames.includes('SOLE_TRADER');

    // Debugging - Check your browser console (F12) to see these values
    console.log('Processed Roles:', roleNames);
    console.log('Display Flags:', {
      link: this.canLinkAccount,
      pos: this.canApplyPos
    });
  }

  logout(): void {
    // Clear user data and navigate to login
    this.storageService.clean(); // or whatever your logout method is
    this.router.navigate(['/login']);
  }
}
