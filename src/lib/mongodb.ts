import { MongoClient } from 'mongodb';

// 环境变量中的MongoDB连接字符串
// 注意：确保在项目根目录的.env.local文件中设置了这个变量
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stonegames';
const MONGODB_DB = process.env.MONGODB_DB || 'stonegames';

// 缓存数据库连接
let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

/**
 * 连接到MongoDB数据库
 * @returns 包含客户端和数据库对象的Promise
 */
export async function connectToDatabase() {
  // 如果已经有缓存的连接，直接返回
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // 创建新的连接
  if (!MONGODB_URI) {
    throw new Error(
      'MongoDB连接字符串未设置。请确保在.env.local文件中设置了MONGODB_URI变量。'
    );
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DB);

  // 缓存连接
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// 集合名称
export const COLLECTIONS = {
  GAMES: 'games',
  CATEGORIES: 'categories',
  USERS: 'users',
  COMMENTS: 'comments',
  RATINGS: 'ratings',
  SETTINGS: 'settings'
}; 