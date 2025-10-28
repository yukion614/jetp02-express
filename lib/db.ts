import mysql, { Pool, PoolConnection } from 'mysql2/promise';

// 資料庫連線設定
const dbConfig: mysql.PoolOptions = {
  host: 'localhost',
  user: 'next_one',
  password: '12345',
  database: 'next_one',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// 建立連線池
const pool: Pool = mysql.createPool(dbConfig);

// 測試連線
export async function testConnection(): Promise<boolean> {
  try {
    const connection: PoolConnection = await pool.getConnection();
    console.log('資料庫連線成功！');
    connection.release();
    return true;
  } catch (error) {
    console.error('資料庫連線失敗:', error);
    return false;
  }
}

export default pool;
