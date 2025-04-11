import { PrismaClient } from '@prisma/client'

// 定义事件类型
type QueryEvent = {
  timestamp: Date
  query: string
  params: string
  duration: number
  target: string
}

type ErrorEvent = {
  message: string
  target: string
}

// 创建Prisma客户端实例
const prismaClientSingleton = () => {
  const client = new PrismaClient({
    log: ['query', 'error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    }
  })

  // 添加事件监听器
  ;(client as any).$on('query', (e: QueryEvent) => {
    console.log('prisma:query', e.query)
  })

  ;(client as any).$on('error', (e: ErrorEvent) => {
    console.error('prisma:error', e.message)
  })

  ;(client as any).$on('warn', (e: ErrorEvent) => {
    console.warn('prisma:warn', e.message)
  })

  return client
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma 