import type { Product, SearchResult, LoadMoreResult } from '../types/index.js';
/**
 * 搜尋產品總數
 * @param search - 搜尋關鍵詞
 * @returns 總項目數
 */
export declare function searchProductsCount(search?: string): Promise<number>;
/**
 * 搜尋產品項目（不分頁）
 * @param search - 搜尋關鍵詞
 * @param offset - 偏移量（用於分頁）
 * @param limit - 每頁數量
 * @returns 產品項目陣列
 */
export declare function searchProductsItems(search?: string, offset?: number, limit?: number): Promise<Product[]>;
/**
 * 搜尋產品函式
 * @param search - 搜尋關鍵詞
 * @param offset - 偏移量（用於分頁）
 * @param limit - 每頁數量
 * @returns 搜尋結果
 */
export declare function searchProducts(search?: string, offset?: number, limit?: number): Promise<SearchResult>;
/**
 * 取得產品詳情
 * @param id - 產品ID
 * @returns 產品詳情或 null
 */
export declare function getProductById(id: number): Promise<Product | null>;
/**
 * 取得所有產品分類
 * @returns 分類陣列
 */
export declare function getCategories(): Promise<string[]>;
/**
 * 搜尋產品函式（用於載入更多）
 * @param search - 搜尋關鍵詞
 * @param offset - 偏移量（用於載入更多）
 * @param limit - 每批數量
 * @param chunkSize - 分塊大小（可選，預設不分塊）
 * @returns 載入更多結果
 */
export declare function searchProductsLoadmore(search?: string, offset?: number, limit?: number, chunkSize?: number): Promise<LoadMoreResult>;
//# sourceMappingURL=products.d.ts.map