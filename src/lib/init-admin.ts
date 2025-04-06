import bcryptjs from 'bcryptjs'
import prisma from './prisma'

/**
 * 初始化管理员账号
 * 如果管理员账号不存在，则创建一个默认的管理员账号
 */
export async function initAdmin() {
  try {
    console.log("开始检查管理员账号")
    
    // 检查是否已存在管理员账号
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        role: 'ADMIN'
      }
    })

    if (existingAdmin) {
      console.log('管理员账号已存在', { email: existingAdmin.email })
      
      // 更新管理员密码，确保密码匹配环境变量中的设置
      if (process.env.ADMIN_PASSWORD) {
        const hashedPassword = await bcryptjs.hash(process.env.ADMIN_PASSWORD, 10)
        
        await prisma.admin.update({
          where: { id: existingAdmin.id },
          data: { 
            password: hashedPassword,
            name: "管理员",
          }
        })
        console.log('管理员密码已更新')
      }
      
      return
    }

    // 创建默认管理员账号
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@stonegames.com'
    
    console.log('创建新管理员账号', { email: adminEmail })
    
    const hashedPassword = await bcryptjs.hash(adminPassword, 10)
    await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "管理员",
        role: 'ADMIN'
      }
    })

    console.log('管理员账号创建成功')
  } catch (error) {
    console.error('初始化管理员账号失败:', error)
  }
} 