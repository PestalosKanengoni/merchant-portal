import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Auth } from './services/auth';
import { StorageService } from './services/storage';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {

  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;

  private routerSubscription?: Subscription

  constructor(private storageService: StorageService,
     private authService: Auth,
      private router: Router,
       private location: Location) { }


  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  protected readonly title = signal('merchant-portal');

   ngOnInit(): void {
    // this.preventBackButtonAfterLogout();
    this.preventUnauthorizedNavigation();

    this.routerSubscription = this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: any) => {
      // If user is not authenticated and tries to access protected routes
      // if (!this.storageService.isLoggedIn() &&
      //     !event.url.includes('/login') &&
      //     !event.url.includes('/sole-trader')) {
      //   this.router.navigate(['/login'], { replaceUrl: true });
      // }

      const isAuthenticated = this.storageService.isLoggedIn();
        const publicRoutes = ['/login', '/sole-trader'];
        const isPublicRoute = publicRoutes.some(route => event.url.includes(route));


        // If user is not authenticated and tries to access protected routes
        if (!isAuthenticated && !isPublicRoute) {
          this.router.navigate(['/login'], { replaceUrl: true });
        }

        // If user is authenticated and tries to access public routes
        if (isAuthenticated && isPublicRoute) {
          this.router.navigate(['/merchant-overview'], { replaceUrl: true });
        }

    });
  }

private preventUnauthorizedNavigation() {
    // Push initial state
    history.pushState(null, '', location.href);

    // Listen for browser back button
    window.addEventListener('popstate', (event) => {
      const isAuthenticated = this.storageService.isLoggedIn();
      const currentUrl = this.location.path();
      const publicRoutes = ['/login', '/sole-trader', '/verify-otp'];
      const isOnPublicRoute = publicRoutes.some(route => currentUrl.includes(route));
       const isOtpVerified = this.storageService.isOtpVerified();
        const isOnOtpPage = currentUrl.includes('/verify-otp');

      if (!isAuthenticated) {
        // User is not authenticated, prevent going back to protected pages
        history.pushState(null, '', location.href);
        this.router.navigate(['/login'], { replaceUrl: true });
      } else if (isAuthenticated && isOnPublicRoute) {
        // User is authenticated but trying to go back to login/otp, redirect to dashboard
        history.pushState(null, '', location.href);
        this.router.navigate(['/merchant-overview'], { replaceUrl: true });
      }else if (isAuthenticated && isOtpVerified && isOnOtpPage) {
        // User is authenticated and OTP verified but trying to go back to OTP page
        history.pushState(null, '', location.href);
        this.router.navigate(['/merchant-overview'], { replaceUrl: true });

      }
    });
  }

}
