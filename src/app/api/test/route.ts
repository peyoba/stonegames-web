import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // 测试数据库连接
    await prisma.$connect()
    
    // 返回成功消息
    return NextResponse.json({ 
      status: 'success',
      message: '数据库连接成功！',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('数据库连接错误:', error)
    return NextResponse.json(
      { 
        status: 'error',
        message: '数据库连接失败',
        error: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    )
  }
} 