import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import {
  setSession,
  getSession,
  deleteSession,
} from './lib/iron-session/express.js'
import { getECPayParams, getHtmlFormContent } from './lib/ecpay/service.js'
import { requestPayment } from './lib/linepay/service.js'
import { searchProducts, searchProductsCount, searchProductsItems } from './lib/products.js'

// #region 設定伺服器區域 ------------------------------
// 建立 express 伺服器
const app = express()
// 設定 cookieParser 來解析 cookies
app.use(cookieParser())
// 設定 bodyParser 來解析 POST 請求
app.use(bodyParser.json())
// 設定 cors 來解決跨域問題
app.use(
  cors({
    origin: 'http://localhost:3000', // 允許前端來源
    credentials: true, // 允許傳送 cookies
  })
)
// #endregion ----------------------------------------

// #region 建立路由區域 ------------------------------
// 商品-建立路由來接獲get資料
// 目前這頁的資料項目(物件陣列) - 所有搜尋參數
app.get('/api/products', async (req: Request, res: Response) => {
  const search = (req.query.search as string) || ''
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.per_page) || 10
  const offset = (page - 1) * limit

  const items = await searchProductsItems(search, offset, limit)
  res.json({ items })
})

// 商品-建立路由來接獲get資料
// 目前這頁的資料筆數 - 只需要會影響搜尋結果數量
app.get('/api/products/count', async (req: Request, res: Response) => {
  const search = (req.query.search as string) || ''
   const count = await searchProductsCount(search)
  res.json({ count })
})

// 建立路由來接獲post資料
// app.post('/api/users/login', (req: Request, res: Response) => {
//   console.log(req.body)
//   res.json({ message: '登入成功' })
// })

// // 建立路由來接獲get資料
// app.get('/api/users', (req: Request, res: Response) => {
//   res.json({ message: '未登入' })
// })

// // 綠界金流測試
// app.get('/api/ecpay', (req: Request, res: Response) => {
//   // 產生參數，這裡的參數是測試用的，實際上需要從前端取得
//   // 總金額為100元，商品為"商品之一x2,商品之二x3,商品之三x4"
//   const result = getECPayParams(990, '商品之一x2,商品之二x3,商品之三x4')
//   // 產生html內容
//   if (result.status === 'success' && 'action' in result.payload) {
//     const htmlContent = getHtmlFormContent(
//       result.payload.action,
//       result.payload.params
//     )
//     // 送出html內容
//     res.send(htmlContent)
//   } else {
//     res.json({ message: 'ECPay 參數產生失敗', error: result.message })
//   }
// })

// app.get('/api/ecpay2', (req: Request, res: Response) => {
//   const amount = Number(req.query.amount) || 0
//   const items = (req.query.items as string) || ''
//   // 產生參數，這裡的參數是測試用的，實際上需要從前端取得
//   // 總金額為100元，商品為"商品之一x2,商品之二x3,商品之三x4"
//   const result = getECPayParams(amount, items)
//   // 產生html內容
//   if (result.status === 'success' && 'action' in result.payload) {
//     const htmlContent = getHtmlFormContent(
//       result.payload.action,
//       result.payload.params
//     )
//     // 送出html內容
//     res.send(htmlContent)
//   } else {
//     res.json({ message: 'ECPay 參數產生失敗', error: result.message })
//   }
// })

// // line pay測試
// app.get('/api/line-pay', async (req: Request, res: Response) => {
//   const result = await requestPayment(100, '商品之一x2,商品之二x3,商品之三x4')
//   console.log(result)
//   res.redirect(result.payload.paymentUrl)
//   // console.log(result);

//   // 如果成功，則導向line pay付款頁面
//   // if (result.status === 'success') {
//   // res.redirect(result.payload.paymentUrl);
//   // } else {
//   //   res.json({ message: "error", result: result });
//   // }
// })

// app.get('/api/line-pay2', async(req: Request, res: Response) => {
//   const amount = Number(req.query.amount) || 0

//   const items = (req.query.items as string) || ''
//   // 產生參數，這裡的參數是測試用的，實際上需要從前端取得
//   // 總金額為100元，商品為"商品之一x2,商品之二x3,商品之三x4"
//   const result = await requestPayment(amount, items)
//   console.log(result)
//   res.redirect(result.payload.paymentUrl)
// })

// #endregion ----------------------------------------

// #region 啟動伺服器區域 ------------------------------
// 啟動伺服器
const server = app.listen(3005, () => {
  console.log('Server started on port 3005.')
})

// 簡化的關閉處理
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down')
  server.close(() => process.exit(0))
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down')
  server.close(() => process.exit(0))
})
// #endregion ----------------------------------------
