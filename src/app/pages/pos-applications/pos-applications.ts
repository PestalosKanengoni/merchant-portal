import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { PosApplicationServ } from '../../services/pos-applicationServ';
import { Auth } from '../../services/auth';
import { StorageService } from '../../services/storage';
import { CommonModule, Location } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { filter } from 'rxjs/operators';

interface ApplicationRequest {
  id: string;
  category: {
    id: string;
    name: string;
    description: string;
  };
  tradeName: string;
  location: string;
  merchantCategoryCode: string;
  account: Array<{
    id: string;
    accountNumber: string;
    accountName: string;
    currency: string;
    customerId: string;
    isPrimary: boolean;
  }>;
  status: string;
  remarks: string;
  approvedAt: string | null;
  createdAt?: string;
}

interface Application {
  remarks: string;
  approvedAt: string | null;
  requests: ApplicationRequest[];
  // Computed properties
  totalRequests?: number;
  uniqueLocations?: string[];
  overallStatus?: string;
}

@Component({
  selector: 'app-pos-applications',
  imports: [CommonModule, RouterModule],
  templateUrl: './pos-applications.html',
  styleUrl: './pos-applications.css',
})
export class PosApplications implements OnInit, OnDestroy {
  userEmail: string = '';
  applications: Application[] = [];
  selectedApplication: Application | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showDetails = false;

  currentPage = 1;
  itemsPerPage = 10;
  Math = Math;

  private destroy$ = new Subject<void>();

  constructor(
    private posService: PosApplicationServ,
    private auth: Auth,
    private storageService: StorageService,
    private location: Location,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.router.url.includes('pos-applications')) {
        console.log('Navigation to pos-applications detected');
        this.loadApplications();
      }
    });
  }

  ngOnInit(): void {
    console.log('PosApplications - ngOnInit called');
    this.userEmail = this.storageService.getUserEmail() || 'Unknown User';
    this.loadApplications();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadApplications(): void {
    console.log('Loading applications...');
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();

    this.posService.getPosApplications().subscribe({
      next: (response) => {
        console.log('✅ Applications received:', response);
        this.isLoading = false;

        if (response.responseCode === '000' || response.responseCode === 'SUCCESS') {
          this.applications = (response.data || []).map((app: Application) => this.enrichApplication(app));

          if (this.applications.length === 0) {
            this.successMessage = 'No applications found. Start by creating a new POS application.';
          }
        } else {
          this.errorMessage = response.responseDescription || 'Failed to load applications';
        }

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Failed to load applications:', error);
        this.isLoading = false;

        if (error.status === 403) {
          this.errorMessage = 'Access Forbidden: Invalid or expired token. Please login again.';
        } else {
          this.errorMessage = error.error?.responseDescription ||
                             error.error?.message ||
                             'Failed to load applications. Please try again.';
        }

        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Enrich application with computed properties
   */
  enrichApplication(app: Application): Application {
    const enriched = { ...app };
    enriched.totalRequests = app.requests.length;

    // Get unique locations
    enriched.uniqueLocations = [...new Set(app.requests.map(r => r.location))];

    // Determine overall status
    const statuses = app.requests.map(r => r.status.toLowerCase());
    if (statuses.every(s => s.includes('approved'))) {
      enriched.overallStatus = 'ALL_APPROVED';
    } else if (statuses.every(s => s.includes('reject'))) {
      enriched.overallStatus = 'ALL_REJECTED';
    } else if (statuses.some(s => s.includes('approved')) && statuses.some(s => s.includes('reject'))) {
      enriched.overallStatus = 'MIXED';
    } else if (statuses.some(s => s.includes('pending'))) {
      enriched.overallStatus = 'PENDING';
    } else {
      enriched.overallStatus = 'UNKNOWN';
    }

    return enriched;
  }

  /**
   * View application requests
   */
  viewApplicationRequests(application: Application): void {
    this.selectedApplication = application;
    this.showDetails = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Close details view
   */
  closeDetails(): void {
    this.showDetails = false;
    this.selectedApplication = null;
  }

  /**
   * Get total applications
   */
  getTotalApplications(): number {
    return this.applications.length;
  }

  /**
   * Get total requests across all applications
   */
  getTotalRequests(): number {
    return this.applications.reduce((total, app) => total + app.requests.length, 0);
  }

  /**
   * Get total pending applications
   */
  getTotalPending(): number {
    return this.applications.filter(app =>
      app.overallStatus === 'PENDING' || app.overallStatus === 'MIXED'
    ).length;
  }

  /**
   * Get paginated applications
   */
  getPaginatedApplications(): Application[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.applications.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.applications.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages: number[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (this.currentPage > 3) pages.push(-1);
      for (let i = Math.max(2, this.currentPage - 1); i <= Math.min(totalPages - 1, this.currentPage + 1); i++) {
        pages.push(i);
      }
      if (this.currentPage < totalPages - 2) pages.push(-1);
      pages.push(totalPages);
    }

    return pages;
  }

  getStatusClass(status: string): string {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('all_approved') || statusLower === 'approved') return 'badge bg-success';
    if (statusLower.includes('pending')) return 'badge bg-warning text-dark';
    if (statusLower.includes('reject')) return 'badge bg-danger';
    if (statusLower.includes('mixed')) return 'badge bg-info';
    return 'badge bg-secondary';
  }

  getRequestStatusClass(status: string): string {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('approved')) return 'badge bg-success-subtle text-success';
    if (statusLower.includes('pending')) return 'badge bg-warning-subtle text-warning';
    if (statusLower.includes('reject')) return 'badge bg-danger-subtle text-danger';
    return 'badge bg-secondary-subtle text-secondary';
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  refreshApplications(): void {
    this.currentPage = 1;
    this.showDetails = false;
    this.selectedApplication = null;
    this.loadApplications();
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  onLogout(): void {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      this.auth.logout();
    }
  }

  goBack(): void {
    if (this.showDetails) {
      this.closeDetails();
    } else {
      this.location.back();
    }
  }
}
