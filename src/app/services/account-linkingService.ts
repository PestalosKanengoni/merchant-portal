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

export interface LinkedAccount {
  id: string;
  accountNumber: string;
  accountName: string;
  currency: string;
  customerId: string;
  isPrimary: boolean;
}

export interface GetLinkedAccountsResponse {
  responseCode: string;
  responseDescription: string;
  data?: LinkedAccount[];
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

   getLinkedAccounts(): Observable<GetLinkedAccountsResponse> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<GetLinkedAccountsResponse>(
      `${this.apiUrl}/accounts`,
      { headers }
    );
  }

}
