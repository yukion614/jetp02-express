/**
 * @fileoverview ECPay 金流服務模組
 *
 * 此模組負責處理綠界科技(ECPay)金流相關的邏輯，包括：
 * - 產生 ECPay 金流參數
 * - 計算 CheckMacValue 驗證碼
 * - 產生 HTML 表單內容
 *
 * 服務層設計原則：
 * - 不使用 throw 錯誤，而是回傳統一格式的物件
 * - 回傳物件包含 status, message, payload 三個屬性
 * - status: 'success' | 'error'
 * - message: string (描述訊息)
 * - payload: any (實際資料)
 *
 */
import type { ECPayParams } from '../../types/index.js';
interface ECPayResult {
    status: 'success' | 'error';
    message: string;
    payload: {
        action: string;
        params: ECPayParams;
    } | {
        amount: number;
        items: string;
    };
}
/**
 * 產生 ECPay 金流參數
 *
 * 此函數負責產生綠界科技金流所需的完整參數，包括：
 * - 產生唯一的交易編號
 * - 計算 CheckMacValue 驗證碼
 * - 設定付款方式與回傳網址
 *
 * @param amount - 交易金額，必須為正整數
 * @param items - 商品名稱，多筆商品以逗號分隔
 *
 * @returns 回傳物件包含以下屬性：
 * - status: 'success' 或 'error'
 * - message: 描述訊息
 * - payload: 實際資料
 *   - action: ECPay API 網址
 *   - params: ECPay 所需的所有參數
 *
 * @example
 * // 單一商品
 * const result = getECPayParams(100, '商品A')
 *
 * @example
 * // 多筆商品
 * const result = getECPayParams(500, '商品A,商品B,商品C')
 *
 * @see {@link https://developers.ecpay.com.tw/?p=2856} ECPay 技術文件
 *  信用卡測試卡號：4311-9522-2222-2222 安全碼 222
 */
export declare const getECPayParams: (amount?: number, items?: string) => ECPayResult;
/**
 * 產生 ECPay 金流 HTML 表單內容
 *
 * 此函數產生一個包含所有 ECPay 參數的 HTML 表單，
 * 用於後端直接送出表單到 ECPay 金流頁面
 *
 * @param action - ECPay API 網址
 * @param params - ECPay 所需的所有參數
 *
 * @returns 完整的 HTML 表單內容，包含：
 * - 隱藏的 input 欄位（包含所有參數）
 * - 自動提交的 JavaScript 程式碼
 *
 * @example
 * // 使用方式
 * const result = getECPayParams(100, '商品A')
 * if (result.status === 'success') {
 *   const htmlContent = getHtmlFormContent(result.payload.action, result.payload.params)
 *   res.send(htmlContent)
 * }
 *
 * @see {@link https://developers.ecpay.com.tw/?p=2856} ECPay 技術文件
 */
export declare const getHtmlFormContent: (action: string, params: ECPayParams) => string;
export {};
//# sourceMappingURL=service.d.ts.map