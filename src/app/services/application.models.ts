export interface Account {
  id: string;
  accountNumber: string;
  accountName: string;
  currency: string;
  customerId: string;
  isPrimary: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface MerchantCategoryCode {
  code: string;
  name: string;
  // Add other properties based on your API response
}

export interface PosRequest {
  id?: string;
  category: Category;
  tradeName: string;
  location: string;
  merchantCategoryCode: string;
  account: Account[];
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  remarks?: string;
  approvedAt?: string;
}

export interface PosApplicationRequest {
  remarks?: string;
  approvedAt?: string;
  requests: PosRequest[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}
