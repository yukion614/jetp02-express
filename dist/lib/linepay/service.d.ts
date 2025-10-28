/**
 * @fileoverview LINE Pay 金流服務模組
 *
 * 此模組負責處理 LINE Pay 金流相關的邏輯，包括：
 * - 產生 LINE Pay 付款請求
 * - 確認付款結果
 * - 檢查付款狀態
 *
 * 服務層設計原則：
 * - 不使用 throw 錯誤，而是回傳統一格式的物件
 * - 回傳物件包含 status, message, payload 三個屬性
 * - status: 'success' | 'error'
 * - message: string (描述訊息)
 * - payload: any (實際資料)
 *
 * @author Express Simple Team
 * @version 1.0.0
 */
import type { LinePayResponse } from '../../types/index.js';
/**
 * 產生 LINE Pay 付款請求
 *
 * 此函數負責向 LINE Pay API 發送付款請求，並回傳付款頁面網址
 *
 * @param amount - 付款金額，必須大於 0
 * @param name - 商品名稱
 * @param orderId - 訂單編號，如未提供則自動產生 UUID
 *
 * @returns 回傳物件包含以下屬性：
 * - status: 'success' 或 'error'
 * - message: 描述訊息
 * - payload: 實際資料
 *   - paymentUrl: LINE Pay 付款頁面網址
 *
 * @example
 * // 基本使用
 * const result = await requestPayment(100, '商品A', '', req, res)
 * if (result.status === 'success') {
 *   res.redirect(result.payload.paymentUrl)
 * }
 *
 * @see {@link https://enylin.github.io/line-pay-merchant/api-reference/request.html#example} LINE Pay 文件
 * @see {@link https://pay.line.me/jp/developers/apis/onlineApis?locale=zh_TW} LINE Pay API 文件
 */
export declare const requestPayment: (amount?: number, name?: string, orderId?: string) => Promise<LinePayResponse>;
/**
 * 確認 LINE Pay 付款結果
 *
 * 此函數用於確認 LINE Pay 付款是否成功完成
 *
 * @param transactionId - LINE Pay 交易編號
 * @param amount - 交易金額，必須大於 0
 *
 * @returns 回傳物件包含以下屬性：
 * - status: 'success' 或 'error'
 * - message: 描述訊息
 * - payload: LINE Pay 確認回應資料
 *
 * @example
 * // 確認付款
 * const result = await confirmPayment('transaction123', 100)
 * if (result.status === 'success') {
 *   console.log('付款成功')
 * }
 *
 * @see {@link https://enylin.github.io/line-pay-merchant/api-reference/confirm.html#example} LINE Pay 文件
 */
export declare const confirmPayment: (transactionId: string, amount?: number) => Promise<LinePayResponse>;
export declare const checkPaymentStatus: (transactionId: string) => Promise<LinePayResponse>;
//# sourceMappingURL=service.d.ts.map