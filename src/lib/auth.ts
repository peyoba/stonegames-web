import bcryptjs from 'bcryptjs'
import prisma from './prisma'

/**
 * 验证管理员密码
 * @param email 邮箱
 * @param password 密码
 * @returns 验证结果和管理员信息
 */
export async function verifyAdmin(email: string, password: string) {
  try {
    // 查找管理员账号
    const admin = await prisma.admin.findFirst({
      where: { email }
    })
    
    if (!admin) {
      return { success: false, message: '管理员账号不存在' }
    }
    
    // 验证密码
    const isValid = await bcryptjs.compare(password, admin.password)
    
    if (!isValid) {
      return { success: false, message: '密码错误' }
    }
    
    // 更新登录时间
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() }
    })
    
    return {
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    }
  } catch (error) {
    console.error('验证管理员失败:', error)
    return { success: false, message: '验证过程中发生错误' }
  }
}

/**
 * 检查管理员权限
 * 在服务器端API中使用
 */
export async function checkAdminAuth(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, message: '未提供有效的认证信息' }
    }
    
    const token = authHeader.split(' ')[1]
    const [email, password] = atob(token).split(':')
    
    return await verifyAdmin(email, password)
  } catch (error) {
    console.error('检查管理员权限失败:', error)
    return { success: false, message: '验证权限时发生错误' }
  }
} 