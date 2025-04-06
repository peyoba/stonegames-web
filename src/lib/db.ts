import { MongoClient } from "mongodb"

if (!process.env.DATABASE_URL) {
  throw new Error('请在环境变量中设置 DATABASE_URL')
}

const uri = process.env.DATABASE_URL
// 添加MongoDB连接选项，提高连接稳定性
const options = {
  maxPoolSize: 10, // 最大连接池大小
  serverSelectionTimeoutMS: 5000, // 服务器选择超时时间(毫秒)
  socketTimeoutMS: 45000, // Socket超时时间(毫秒)
}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // 在开发环境中使用全局变量，这样热重载不会创建新的连接
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // 在生产环境中创建新的连接
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise 