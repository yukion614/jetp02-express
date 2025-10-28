/**
 * @fileoverview 全域類型定義
 *
 * 此檔案包含整個專案中使用的通用類型定義
 */
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
export interface SearchResult {
    items: Product[];
    total: number;
}
export interface LoadMoreResult {
    items: Product[] | Product[][];
    hasMore: boolean;
}
export interface ApiResponse<T = any> {
    status: 'success' | 'error';
    message?: string;
    payload?: T;
}
export interface SessionData {
    [key: string]: any;
}
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
export type QueryResult = [any[], any];
export interface PaginationParams {
    page?: number;
    limit?: number;
    offset?: number;
}
export interface SearchParams extends PaginationParams {
    search?: string;
    category?: string;
}
//# sourceMappingURL=index.d.ts.map