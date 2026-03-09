import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { authGuard, guestGuard, passwordCheckGuard } from './guard/auth-guard';
import { Dashboard } from './dashboard/dashboard';
import { NgModule } from '@angular/core';
import { SoleTrader } from './pages/sole-trader/sole-trader';
import { OtpVerification } from './pages/otp-verification/otp-verification';
import { PosApplication } from './pages/pos-application/pos-application';
import { AccountLinking } from './pages/account-linking/account-linking';
import { MerchantOverview } from './pages/merchant-overview/merchant-overview';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login').then(m => m.Login),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register').then(m => m.Register),
    canActivate: [authGuard]
  },
  {
    path: 'merchant-overview',
    loadComponent: () => import('./pages/merchant-overview/merchant-overview').then(m => m.MerchantOverview),
    canActivate: [authGuard, passwordCheckGuard]
  },
  {
    path: 'sole-trader',
    loadComponent: () => import('./pages/sole-trader/sole-trader').then(m => m.SoleTrader)
  },
  {
    path: 'pos-application',
    loadComponent: () => import('./pages/pos-application/pos-application').then(m => m.PosApplication),
    canActivate: [authGuard]
  },
  {
    path: 'verify-otp',
    loadComponent: () => import('./pages/otp-verification/otp-verification').then(m => m.OtpVerification),
    canActivate: [authGuard]
  },
  {
    path: 'account-linking',
    loadComponent: () => import('./pages/account-linking/account-linking').then(m => m.AccountLinking),
    canActivate: [authGuard]
  },
  {
    path: 'pos-stats',
    loadComponent: () => import('./pages/pos-stats/pos-stats').then(m => m.PosStats),
    canActivate: [authGuard]
  },
  {
    path: 'pos-applications',
    loadComponent: () => import('./pages/pos-applications/pos-applications').then(m => m.PosApplications),
    canActivate: [authGuard]
  }
]
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
