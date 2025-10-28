/**
 * @fileoverview 全域類型定義
 * 
 * 此檔案包含整個專案中使用的通用類型定義
 */

// 產品相關類型
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: string | null;
  created_at: Date;
  updated_at: Date;
}

// 搜尋結果類型
export interface SearchResult {
  items: Product[];
  total: number;
}

// 載入更多結果類型
export interface LoadMoreResult {
  items: Product[] | Product[][];
  hasMore: boolean;
}

// API 回應類型
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  payload?: T;
}

// Session 資料類型
export interface SessionData {
  [key: string]: any;
}

// ECPay 參數類型
export interface ECPayParams {
  MerchantID: string;
  MerchantTradeNo: string;
  MerchantTradeDate: string;
  PaymentType: string;
  EncryptType: number;
  TotalAmount: number;
  TradeDesc: string;
  ItemName: string;
  ReturnURL: string;
  ChoosePayment: string;
  OrderResultURL?: string;
  ClientBackURL?: string;
  CheckMacValue: string;
}

// LINE Pay 訂單類型
export interface LinePayOrder {
  orderId: string;
  currency: string;
  amount: number;
  packages: Array<{
    id: string;
    amount: number;
    products: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
    }>;
  }>;
  options: {
    display: {
      locale: string;
    };
  };
  redirectUrls: {
    confirmUrl: string;
    cancelUrl: string;
  };
}

// LINE Pay 回應類型
export interface LinePayResponse {
  status: 'success' | 'error';
  message?: string;
  payload: {
    reservation: LinePayOrder & {
      returnCode: string;
      returnMessage: string;
      transactionId: string;
      paymentAccessToken: string;
    };
    paymentUrl: string;
  } | {
    amount: number;
    name: string;
    orderId: string;
  } | {
    transactionId: string;
    amount: number;
  } | any;
}

// 資料庫查詢結果類型
export type QueryResult = [any[], any];

// 分頁參數類型
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

// 搜尋參數類型
export interface SearchParams extends PaginationParams {
  search?: string;
  category?: string;
}
