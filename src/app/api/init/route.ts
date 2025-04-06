import { NextResponse } from 'next/server'
import { initAdmin } from '@/lib/init-admin'

export async function GET() {
  try {
    await initAdmin()
    return NextResponse.json({ message: '管理员账号初始化成功' })
  } catch (error) {
    console.error('初始化管理员账号失败:', error)
    return NextResponse.json(
      { error: '初始化管理员账号失败' },
      { status: 500 }
    )
  }
} 