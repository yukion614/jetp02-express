import pool from './db.js';
import type { 
  Product, 
  SearchResult, 
  LoadMoreResult, 
  QueryResult 
} from '../types/index.js';

/**
 * 搜尋產品總數
 * @param search - 搜尋關鍵詞
 * @returns 總項目數
 */
export async function searchProductsCount(search: string = ''): Promise<number> {
  try {
    let countQuery: string;
    let countParams: (string | number)[];

    if (search) {
      // 有搜尋條件的情況
      countQuery = `
        SELECT COUNT(*) as count 
        FROM products 
        WHERE name LIKE ? OR description LIKE ? OR category LIKE ?
      `;
      countParams = [`%${search}%`, `%${search}%`, `%${search}%`];
    } else {
      // 沒有搜尋條件的情況
      countQuery = `
        SELECT COUNT(*) as count 
        FROM products
      `;
      countParams = [];
    }

    // 執行查詢
    const [countResult] = (await pool.execute(countQuery, countParams)) as QueryResult;
    // 回傳總項目數
    return countResult[0].count;
  } catch (error) {
    console.error('搜尋產品總數時出錯:', error);
    throw new Error('搜尋產品總數失敗');
  }
}

/**
 * 搜尋產品項目（不分頁）
 * @param search - 搜尋關鍵詞
 * @param offset - 偏移量（用於分頁）
 * @param limit - 每頁數量
 * @returns 產品項目陣列
 */
export async function searchProductsItems(
  search: string = '', 
  offset: number = 0, 
  limit: number = 10
): Promise<Product[]> {
  try {
    let productsQuery: string;
    let productsParams: (string | number)[];

    if (search) {
      // 有搜尋條件的情況
      productsQuery = `
        SELECT 
          id,
          name,
          description,
          price,
          category,
          stock,
          image_url,
          created_at,
          updated_at
        FROM products 
        WHERE name LIKE ? OR description LIKE ? OR category LIKE ?
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      productsParams = [`%${search}%`, `%${search}%`, `%${search}%`];
    } else {
      // 沒有搜尋條件的情況
      productsQuery = `
        SELECT 
          id,
          name,
          description,
          price,
          category,
          stock,
          image_url,
          created_at,
          updated_at
        FROM products 
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      productsParams = [];
    }

    // 執行查詢
    const [productsResult] = (await pool.execute(
      productsQuery,
      productsParams
    )) as QueryResult;
    return productsResult as Product[];
  } catch (error) {
    console.error('搜尋產品項目時出錯:', error);
    throw new Error('搜尋產品項目失敗');
  }
}

/**
 * 搜尋產品函式
 * @param search - 搜尋關鍵詞
 * @param offset - 偏移量（用於分頁）
 * @param limit - 每頁數量
 * @returns 搜尋結果
 */
export async function searchProducts(
  search: string = '', 
  offset: number = 0, 
  limit: number = 10
): Promise<SearchResult> {
  try {
    let countQuery: string;
    let productsQuery: string;
    let countParams: (string | number)[];
    let productsParams: (string | number)[];

    if (search) {
      // 有搜尋條件的情況
      countQuery = `
        SELECT COUNT(*) as total 
        FROM products 
        WHERE name LIKE ? OR description LIKE ? OR category LIKE ?
      `;
      countParams = [`%${search}%`, `%${search}%`, `%${search}%`];

      productsQuery = `
        SELECT 
          id,
          name,
          description,
          price,
          category,
          stock,
          image_url,
          created_at,
          updated_at
        FROM products 
        WHERE name LIKE ? OR description LIKE ? OR category LIKE ?
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      productsParams = [`%${search}%`, `%${search}%`, `%${search}%`];
    } else {
      // 沒有搜尋條件的情況
      countQuery = `
        SELECT COUNT(*) as total 
        FROM products
      `;
      countParams = [];

      productsQuery = `
        SELECT 
          id,
          name,
          description,
          price,
          category,
          stock,
          image_url,
          created_at,
          updated_at
        FROM products 
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      productsParams = [];
    }

    // 執行查詢
    const [countResult] = (await pool.execute(countQuery, countParams)) as QueryResult;
    const [productsResult] = (await pool.execute(
      productsQuery,
      productsParams
    )) as QueryResult;

    return {
      items: productsResult as Product[],
      total: countResult[0].total,
    };
  } catch (error) {
    console.error('搜尋產品時出錯:', error);
    throw new Error('搜尋產品失敗');
  }
}

/**
 * 取得產品詳情
 * @param id - 產品ID
 * @returns 產品詳情或 null
 */
export async function getProductById(id: number): Promise<Product | null> {
  try {
    const query = `
      SELECT 
        id,
        name,
        description,
        price,
        category,
        stock,
        image_url,
        created_at,
        updated_at
      FROM products 
      WHERE id = ?
    `;

    const [rows] = (await pool.execute(query, [id])) as QueryResult;
    return (rows[0] as Product) || null;
  } catch (error) {
    console.error('取得產品詳情時出錯:', error);
    throw new Error('取得產品詳情失敗');
  }
}

/**
 * 取得所有產品分類
 * @returns 分類陣列
 */
export async function getCategories(): Promise<string[]> {
  try {
    const query = `
      SELECT DISTINCT category 
      FROM products 
      WHERE category IS NOT NULL 
      ORDER BY category
    `;

    const [rows] = (await pool.execute(query)) as QueryResult;
    return rows.map((row: any) => row.category);
  } catch (error) {
    console.error('取得產品分類時出錯:', error);
    throw new Error('取得產品分類失敗');
  }
}

/**
 * 搜尋產品函式（用於載入更多）
 * @param search - 搜尋關鍵詞
 * @param offset - 偏移量（用於載入更多）
 * @param limit - 每批數量
 * @param chunkSize - 分塊大小（可選，預設不分塊）
 * @returns 載入更多結果
 */
export async function searchProductsLoadmore(
  search: string = '',
  offset: number = 0,
  limit: number = 10,
  chunkSize: number = 0
): Promise<LoadMoreResult> {
  try {
    let productsQuery: string;
    let productsParams: (string | number)[];
    let hasMoreQuery: string;
    let hasMoreParams: (string | number)[];

    if (search) {
      // 有搜尋條件的情況
      productsQuery = `
        SELECT 
          id,
          name,
          description,
          price,
          category,
          stock,
          created_at,
          updated_at
        FROM products 
        WHERE name LIKE ? OR description LIKE ? OR category LIKE ?
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET 0
      `;
      productsParams = [`%${search}%`, `%${search}%`, `%${search}%`];

      // 檢查是否還有更多數據 - 使用子查詢來檢查下一批數據是否存在
      hasMoreQuery = `
        SELECT EXISTS(
          SELECT 1
          FROM products 
          WHERE name LIKE ? OR description LIKE ? OR category LIKE ?
          ORDER BY created_at DESC
          LIMIT 1 OFFSET ${offset + limit}
        ) as hasMore
      `;
      hasMoreParams = [`%${search}%`, `%${search}%`, `%${search}%`];
    } else {
      // 沒有搜尋條件的情況
      productsQuery = `
        SELECT 
          id,
          name,
          description,
          price,
          category,
          stock,
          created_at,
          updated_at
        FROM products 
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET 0
      `;
      productsParams = [];

      // 檢查是否還有更多數據 - 使用子查詢來檢查下一批數據是否存在
      hasMoreQuery = `
        SELECT EXISTS(
          SELECT 1
          FROM products 
          ORDER BY created_at DESC
          LIMIT 1 OFFSET ${offset + limit}
        ) as hasMore
      `;
      hasMoreParams = [];
    }

    // 執行查詢
    const [productsResult] = (await pool.execute(
      productsQuery,
      productsParams
    )) as QueryResult;
    const [hasMoreResult] = (await pool.execute(
      hasMoreQuery,
      hasMoreParams
    )) as QueryResult;

    console.log(productsResult, productsQuery);
    console.log(hasMoreResult, hasMoreQuery);

    // 如果需要分塊，則進行分塊處理
    let items: Product[] | Product[][] = productsResult as Product[];
    if (chunkSize > 0 && productsResult.length > 0) {
      const chunkedItems: Product[][] = [];
      for (let i = 0; i < productsResult.length; i += chunkSize) {
        chunkedItems.push(productsResult.slice(i, i + chunkSize) as Product[]);
      }
      items = chunkedItems;
    }

    return {
      items: items,
      hasMore: hasMoreResult[0].hasMore === 1,
    };
  } catch (error) {
    console.error('載入更多產品時出錯:', error);
    throw new Error('載入更多產品失敗');
  }
}