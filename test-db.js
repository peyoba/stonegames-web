// MongoDB 连接测试脚本
const { PrismaClient } = require('@prisma/client')

async function main() {
  const prisma = new PrismaClient()
  
  try {
    console.log('正在连接数据库...')
    
    // 执行一个简单的查询以测试连接
    const adminCount = await prisma.admin.count()
    console.log(`数据库连接成功! 管理员数量: ${adminCount}`)
    
    // 创建默认管理员（如果不存在）
    const adminExists = await prisma.admin.findFirst({
      where: { role: 'ADMIN' }
    })
    
    if (!adminExists) {
      console.log('创建默认管理员账号...')
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash('123456', 10)
      
      await prisma.admin.create({
        data: {
          email: 'admin@stonegames.com',
          name: '管理员',
          password: hashedPassword,
          role: 'ADMIN'
        }
      })
      console.log('默认管理员账号创建成功!')
    } else {
      console.log('管理员账号已存在')
    }
  } catch (error) {
    console.error('数据库连接失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 