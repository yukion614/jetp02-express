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
import * as crypto from 'crypto';
import { createLinePayClient } from 'line-pay-merchant';
import { config } from './config.js';
// 定義安全的私鑰字串
const linePayClient = createLinePayClient({
    channelId: config.channelId,
    channelSecretKey: config.channelSecret,
    env: 'development',
});
// 設定重新導向與失敗導向的網址
const redirectUrls = {
    confirmUrl: config.confirmUrl,
    cancelUrl: config.cancelUrl,
};
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
export const requestPayment = async (amount = 0, name = '商品一批', orderId = '') => {
    // 使用目前最新的v3版本的API，以下是資料的說明:
    // https://pay.line.me/jp/developers/apis/onlineApis?locale=zh_TW
    // packages[]	是包裝的集合，每個包裝可以包含多個商品，以下(Y)是必要的欄位
    //
    // packages[].id	String	50	Y	Package list的唯一ID
    // packages[].amount	Number		Y	一個Package中的商品總價=sum(products[].quantity * products[].price)
    // packages[].userFee	Number		N	手續費：在付款金額中含手續費時設定
    // packages[].name	String	100	N	Package名稱 （or Shop Name）
    // products[]	是商品的集合，包含多個商品，以下有(Y)是必要的欄位
    //
    // packages[].products[].id	String	50	N	商家商品ID
    // packages[].products[].name	String	4000	Y	商品名
    // packages[].products[].imageUrl	String	500	N	商品圖示的URL
    // packages[].products[].quantity	Number		Y	商品數量
    // packages[].products[].price	Number		Y	各商品付款金額
    // packages[].products[].originalPrice	Number		N	各商品原金額
    // 金額不能小等於於0
    if (amount <= 0) {
        return {
            status: 'error',
            message: '金額不能小於0',
            payload: { amount, name, orderId },
        };
    }
    // 要傳送給line pay的訂單資訊
    const order = {
        // 訂單編號: 如果沒有提供，則使用uuid
        orderId: orderId || crypto.randomUUID(),
        currency: 'TWD',
        amount: amount,
        packages: [
            {
                id: crypto.randomBytes(5).toString('hex'),
                amount: amount,
                products: [
                    {
                        id: crypto.randomBytes(5).toString('hex'),
                        name: name,
                        quantity: 1,
                        price: amount,
                    },
                ],
            },
        ],
        options: { display: { locale: 'zh_TW' } },
        redirectUrls, // 設定重新導向與失敗導向的網址
    };
    console.log('訂單資料:', order);
    try {
        // 向line pay傳送的訂單資料
        const linePayResponse = await linePayClient.request.send({
            body: { ...order, redirectUrls },
        });
        // 深拷貝一份order資料
        const reservation = JSON.parse(JSON.stringify(order));
        reservation.returnCode = linePayResponse.body.returnCode;
        reservation.returnMessage = linePayResponse.body.returnMessage;
        reservation.transactionId = linePayResponse.body.info.transactionId;
        reservation.paymentAccessToken =
            linePayResponse.body.info.paymentAccessToken;
        console.log('預計付款記錄(Reservation):', reservation);
        // line pay回應後會帶有info.paymentUrl.web為付款網址
        return {
            status: 'success',
            payload: {
                reservation: reservation,
                paymentUrl: linePayResponse.body.info.paymentUrl.web,
            },
        };
    }
    catch (error) {
        return { status: 'error', message: error.message, payload: { amount, name, orderId } };
    }
};
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
// 備註: 可以從從session得到交易金額，也可以從資料庫以訂單編號得到交易金額，transactionId也應該存到資料庫妥善保管(在交易後會得到transactionId)
export const confirmPayment = async (transactionId, amount = 0) => {
    if (!transactionId) {
        return { status: 'error', message: '缺少交易編號', payload: { transactionId, amount } };
    }
    if (amount <= 0) {
        return { status: 'error', message: '金額不能小於0', payload: { transactionId, amount } };
    }
    try {
        // 最後確認交易
        const linePayResponse = await linePayClient.confirm.send({
            transactionId: transactionId,
            body: {
                currency: 'TWD',
                amount: amount,
            },
        });
        // linePayResponse.body回傳的資料
        console.log('line-pay confirm response: ', linePayResponse);
        // 回傳line pay的回應
        return {
            status: 'success',
            payload: { ...linePayResponse.body },
        };
    }
    catch (error) {
        return { status: 'error', message: error.message, payload: { transactionId, amount } };
    }
};
// 一段時間後檢查交易情況，僅提供範例，可以根據需要修改
export const checkPaymentStatus = async (transactionId) => {
    try {
        const linePayResponse = await linePayClient.checkPaymentStatus.send({
            transactionId: transactionId,
            params: {},
        });
        // 範例:
        // {
        //   "body": {
        //     "returnCode": "0000",
        //     "returnMessage": "reserved transaction."
        //   },
        //   "comments": {}
        // }
        return { status: 'success', payload: { ...linePayResponse.body } };
    }
    catch (error) {
        return { status: 'error', message: error.message, payload: { transactionId } };
    }
};
//# sourceMappingURL=service.js.map