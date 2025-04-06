import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("开始初始化管理员账号...")
    
    // 删除现有的管理员账号
    await prisma.admin.deleteMany({
      where: {
        email: 'admin@stonegames.com'
      }
    })
    
    console.log("已删除旧的管理员账号")

    // 创建新的密码哈希
    const hashedPassword = await bcrypt.hash('admin123', 10)
    console.log("密码加密完成")

    // 创建新的管理员账号
    const admin = await prisma.admin.create({
      data: {
        email: 'admin@stonegames.com',
        password: hashedPassword,
        name: '管理员',
        role: 'ADMIN'
      }
    })

    console.log("管理员账号创建成功:", admin)
  } catch (error) {
    console.error("初始化管理员账号失败:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 