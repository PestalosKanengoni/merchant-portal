import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subject, throwError } from 'rxjs';
import { StorageService } from './storage';
import { Account, Category, MerchantCategoryCode, PosApplicationRequest } from './application.models';


interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}


@Injectable({
  providedIn: 'root',
})
export class PosApplicationServ {

  private baseUrl = 'http://192.168.4.13:8099/api/merchant';

  constructor(private http: HttpClient,private storageService: StorageService) {}

  /**
   * Get HTTP headers with authentication token
   */
  private getHeaders(): HttpHeaders {
    const token = this.storageService.getToken();

    if (!token) {
      console.warn('No authentication token found');
    }

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Fetch merchant accounts (authenticated)
   */
  getAccounts(): Observable<Account[]> {
    const url = `${this.baseUrl}/accounts`;

    return this.http.get<ApiResponse<Account[]>>(url, { headers: this.getHeaders() }).pipe(
      map(response => {
        // const acc = response.data;
        console.log('Accounts fetched:', response);
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching accounts:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Fetch merchant categories
   */
  getCategories(): Observable<Category[]> {
    const url = `${this.baseUrl}/category`;

    return this.http.get<ApiResponse<Category[]>>(url, { headers: this.getHeaders() }).pipe(
      map(response => {
        // const categories = response.data;
        console.log('Categories fetched:', response);
        // console.log('Categories fetched:', response);
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching categories:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Fetch merchant category codes (MCC)
   */
  getMerchantCategoryCodes(): Observable<MerchantCategoryCode[]> {
    const url = `${this.baseUrl}/getMCC`;

    return this.http.get<MerchantCategoryCode[]>(url, { headers: this.getHeaders() }).pipe(
      map(response => {
        console.log('MCCs fetched:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error fetching MCCs:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Submit POS application
   */
  submitPosApplication(application: PosApplicationRequest): Observable<any> {
    const url = `${this.baseUrl}/pos-application`;

    return this.http.post<ApiResponse<any>>(url, application, { headers: this.getHeaders() }).pipe(
      map(response => {
        console.log('POS application submitted:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error submitting POS application:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get POS applications (if you have an endpoint to fetch existing applications)
   */
  getPosApplications(): Observable<PosApplicationRequest[]> {
    const url = `${this.baseUrl}/pos-application`;

    return this.http.get<ApiResponse<PosApplicationRequest[]>>(url, { headers: this.getHeaders() }).pipe(
      map(response => {
        console.log('POS applications fetched:', response);
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching POS applications:', error);
        return throwError(() => error);
      })
    );
  }

}
