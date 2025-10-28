# Express Simple TypeScript 範例專案

這是一個使用 TypeScript 開發的 Express.js 範例專案，包含了常用的功能模組：

- **Iron Session**: 安全的 session 管理
- **ECPay**: 綠界科技金流整合
- **LINE Pay**: LINE Pay 金流整合
- **CORS**: 跨域請求處理
- **Cookie Parser**: Cookie 解析
- **Body Parser**: 請求體解析

## 專案特色

- ✅ 完整的 TypeScript 型別定義
- ✅ 模組化設計
- ✅ 統一的錯誤處理格式
- ✅ 開發環境熱重載（使用 tsx）
- ✅ 生產環境編譯支援
- ✅ ES 模組支援

## 安裝與執行

### 1. 安裝依賴

```bash
npm install
```

### 2. 開發模式執行

```bash
# 使用 nodemon 熱重載（推薦）
npm run dev

# 或直接使用 tsx 執行
npm run dev:tsx
```

伺服器將在 `http://localhost:3005` 啟動

### 3. 類型檢查

```bash
npm run type-check
```

### 4. 編譯為生產版本

```bash
npm run build
npm start
```

## API 端點

### 使用者相關
- `POST /api/users/login` - 使用者登入
- `GET /api/users` - 取得使用者資訊

### Session 管理
- `GET /api/session-set?name=使用者名稱` - 設定 session
- `GET /api/session-get` - 取得 session 資料

### ECPay 金流
- `GET /api/ecpay` - ECPay 測試付款（固定金額 990 元）
- `GET /api/ecpay2?amount=金額&items=商品名稱` - ECPay 動態付款

### LINE Pay 金流
- `GET /api/line-pay` - LINE Pay 測試付款（固定金額 100 元）
- `GET /api/line-pay2?amount=金額&items=商品名稱` - LINE Pay 動態付款

## 專案結構

```
express-simple-ts/
├── app.ts                 # 主應用程式檔案
├── tsconfig.json         # TypeScript 配置
├── package.json          # 專案依賴與腳本
├── nodemon.json          # 開發環境配置
├── lib/                  # 模組目錄
│   ├── iron-session/     # Session 管理模組
│   │   ├── config.ts     # Session 配置
│   │   └── express.ts    # Session 功能
│   ├── ecpay/           # ECPay 金流模組
│   │   ├── config.ts     # ECPay 配置
│   │   └── service.ts    # ECPay 服務
│   ├── linepay/         # LINE Pay 金流模組
│   │   ├── config.ts     # LINE Pay 配置
│   │   └── service.ts    # LINE Pay 服務
│   ├── products.ts      # 產品管理模組
│   └── db.ts            # 資料庫連線模組
├── types/               # 全域類型定義
│   └── index.ts         # 所有類型定義
└── dist/                # 編譯後的 JavaScript 檔案（執行 build 後產生）
```

## TypeScript 型別定義

### 產品相關型別
```typescript
interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  stock: number
  image_url: string | null
  created_at: Date
  updated_at: Date
}

interface SearchResult {
  items: Product[]
  total: number
}

interface LoadMoreResult {
  items: Product[] | Product[][]
  hasMore: boolean
}
```

### Session 資料型別
```typescript
interface SessionData {
  [key: string]: any
}
```

### ECPay 參數型別
```typescript
interface ECPayParams {
  MerchantID: string
  MerchantTradeNo: string
  MerchantTradeDate: string
  PaymentType: string
  EncryptType: number
  TotalAmount: number
  TradeDesc: string
  ItemName: string
  ReturnURL: string
  ChoosePayment: string
  OrderResultURL?: string
  ClientBackURL?: string
  CheckMacValue: string
}
```

### LINE Pay 訂單型別
```typescript
interface LinePayOrder {
  orderId: string
  currency: string
  amount: number
  packages: Array<{
    id: string
    amount: number
    products: Array<{
      id: string
      name: string
      quantity: number
      price: number
    }>
  }>
  options: {
    display: {
      locale: string
    }
  }
  redirectUrls: {
    confirmUrl: string
    cancelUrl: string
  }
}
```

## 配置說明

### ECPay 配置
在 `lib/ecpay/config.ts` 中設定：
- `hasOrderResult`: 是否使用 OrderResultURL（有回傳結果）
- `OrderResultURL`: 有回傳結果時的前端 API 路由
- `ClientBackURL`: 無回傳結果時的前端成功頁面

### LINE Pay 配置
在 `lib/linepay/config.ts` 中設定：
- `channelId`: LINE Pay 頻道 ID
- `channelSecret`: LINE Pay 頻道密鑰
- `confirmUrl`: 付款確認後導向的網址
- `cancelUrl`: 付款取消後導向的網址

### Iron Session 配置
在 `lib/iron-session/config.ts` 中設定：
- `password`: Session 加密密鑰（32 字元）
- `ttl`: Session 存活時間（秒）
- `cookieOptions`: Cookie 選項

## 開發注意事項

1. **型別安全**: 所有函數都有完整的型別定義
2. **錯誤處理**: 統一使用 `{ status: 'success' | 'error', message: string, payload: any }` 格式
3. **模組化**: 每個功能都獨立成模組，便於維護和測試
4. **ES 模組**: 使用 ES6 模組語法，支援 `import/export`

## 測試金流

### ECPay 測試
- 信用卡測試卡號：`4311-9522-2222-2222`
- 安全碼：`222`

### LINE Pay 測試
- 使用 LINE Pay 測試環境
- 需要有效的 LINE Pay 測試帳號

## 授權

ISC License - 由 Eddy Chang 開發