import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

/**
 * 获取网络设置
 * @returns 网络设置
 */
export async function GET(
  _request: Request
) {
  try {
    const { db } = await connectToDatabase()
    const networkSettings = await db.collection('networkSettings').findOne({})

    if (!networkSettings) {
      return NextResponse.json(
        { error: '网络设置不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json(networkSettings)
  } catch (error) {
    console.error('获取网络设置失败:', error)
    return NextResponse.json(
      { error: '获取网络设置失败' },
      { status: 500 }
    )
  }
}

/**
 * 更新网络设置
 * @param request 请求对象
 * @returns 更新后的网络设置
 */
export async function PUT(
  request: Request
) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()
    const { networkName, networkType } = body

    if (!networkName || !networkType) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      )
    }

    const updateData = {
      networkName,
      networkType,
      updatedAt: new Date()
    }

    await db.collection('networkSettings').updateOne(
      {},
      { $set: updateData },
      { upsert: true }
    )

    const updatedNetworkSettings = await db.collection('networkSettings').findOne({})

    return NextResponse.json(updatedNetworkSettings)
  } catch (error) {
    console.error('更新网络设置失败:', error)
    return NextResponse.json(
      { error: '更新网络设置失败' },
      { status: 500 }
    )
  }
} 