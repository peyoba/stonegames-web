// 初始化管理员账号脚本
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('正在连接数据库...');
    
    // 检查是否已存在管理员账号
    const adminExists = await prisma.admin.findFirst({
      where: { role: 'ADMIN' }
    });
    
    if (adminExists) {
      console.log('管理员账号已存在');
      return;
    }
    
    // 创建管理员账号
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.admin.create({
      data: {
        email: 'admin@stonegames.com',
        password: hashedPassword,
        name: '管理员',
        role: 'ADMIN'
      }
    });
    
    console.log('管理员账号创建成功:', admin);
  } catch (error) {
    console.error('创建管理员账号失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 