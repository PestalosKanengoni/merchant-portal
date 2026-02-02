import { Injectable } from '@angular/core';

// const USER_KEY = 'auth-user';
const TOKEN_KEY = 'accessToken';
const OTP_VERIFIED_KEY = 'otp_verified';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  // private USER_KEY = 'auth-user'

  // constructor() {}

  //  clean(): void {
  //   window.sessionStorage.clear();
  // }

  //  saveUser(user: any): void {
  //   window.sessionStorage.removeItem(this.USER_KEY);
  //   window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
  //   console.log('User saved to storage: ', user)
  // }

  //  getToken(): string | null {
  //   const user = this.getUser();
  //   console.log('Getting token from user:', user);

  //   const token = user?.token || user?.accessToken || user?.jwtToken || user?.bearerToken;

  //    console.log('Token found:', token ? 'YES' : 'NO');

  //   return token;
  // }

  // public getUser(): any {
  //   const user = window.sessionStorage.getItem(this.USER_KEY);
  //   if (user) {
  //     return JSON.parse(user);
  //   }

  //   return {};
  // }

  // public isLoggedIn(): boolean {
  //   const user = window.sessionStorage.getItem(this.USER_KEY);
  //   if (user) {
  //     return true;
  //   }

  //   return false;
  // }

  //  getUserEmail(): string | null {
  //   const user = this.getUser();
  //   return user?.email || null;
  // }

  // /**
  //  * Get user name
  //  */
  // getUserName(): string | null {
  //   const user = this.getUser();
  //   return user?.name || user?.username || user?.fullName || null;
  // }

  //   getUserId(): string | null {
  //   const user = this.getUser();
  //   return user?.id || user?.userId || user?.customerId || null;
  // }

  //   getDirectToken(): string | null {
  //   return window.sessionStorage.getItem(TOKEN_KEY);
  // }

  private USER_KEY = 'auth-user';

  // ... (clean and saveUser remain the same)

  public getUser(): any {
    const data = window.sessionStorage.getItem(this.USER_KEY);
    if (data) {
      const parsedData = JSON.parse(data);
      // If the response has a nested 'user' object, return that.
      // Otherwise, return the whole object.
      return parsedData.user ? parsedData.user : parsedData;
    }
    return null; // Return null instead of {} for better safety checks
  }

  // This ensures your app always gets the token even if getUser() is nested
  getToken(): string | null {
    const data = window.sessionStorage.getItem(this.USER_KEY);
    if (data) {
      const parsedData = JSON.parse(data);
      return parsedData.accessToken || parsedData.token || null;
    }
    return null;
  }


   saveUser(user: any): void {
    window.sessionStorage.removeItem(this.USER_KEY);
    window.sessionStorage.setItem(this.USER_KEY, JSON.stringify(user));
    console.log('User saved to storage: ', user)
  }

  getUserEmail(): string | null {
    const user = this.getUser();
    return user?.email || null;
  }

    clean(): void {
    window.sessionStorage.clear();
  }

  getUserName(): string | null {
    const user = this.getUser();
    // According to your JSON, the user object has email but maybe not 'name'
    return user?.username || user?.email || null;
  }

    public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(this.USER_KEY);
    if (user) {
      return true;
    }
     return false;
   }

  getUserId(): string | null {
    const user = this.getUser();
    return user?.id || null;
  }

  public setOtpVerified(verified: boolean): void {
    window.sessionStorage.setItem(OTP_VERIFIED_KEY, JSON.stringify(verified));
  }

  /**
   * Check if OTP has been verified
   * @returns true if OTP is verified, false otherwise
   */
  public isOtpVerified(): boolean {
    const otpStatus = window.sessionStorage.getItem(OTP_VERIFIED_KEY);
    return otpStatus ? JSON.parse(otpStatus) : false;
  }

  /**
   * Clear OTP verification status (call this on logout)
   */
  public clearOtpVerified(): void {
    window.sessionStorage.removeItem(OTP_VERIFIED_KEY);
  }


}
