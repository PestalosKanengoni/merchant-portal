import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from './storage';

export interface LinkAccountRequest {
  account: string;
}

export interface LinkAccountResponse {
  responseCode: string;
  responseDescription: string;
  data?: any;
}


@Injectable({
  providedIn: 'root',
})
export class AccountLinkingService {

  private apiUrl = 'http://192.168.4.13:8099/api/merchant';

  constructor(private http: HttpClient, private storageService: StorageService) { }

  /**
   * Link a new account to the merchant profile
   * @param account - The account string (phone number, bank account, etc.)
   * @returns Observable with the API response
   */
  linkAccount(account: string): Observable<LinkAccountResponse> {
    const token = this.storageService.getToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const body: LinkAccountRequest = {
      account: account
    };

    return this.http.post<LinkAccountResponse>(
      `${this.apiUrl}/link-account`,
      body,
      { headers }
    );
  }

}
