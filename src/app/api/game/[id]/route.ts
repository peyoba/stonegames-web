import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

/**
 * 获取指定ID的游戏详情
 * @param params 路由参数，包含游戏ID
 * @returns 游戏详情
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase()
    const game = await db.collection('games').findOne({
      _id: new ObjectId(params.id)
    })

    if (!game) {
      return NextResponse.json(
        { error: '游戏不存在' },
        { status: 404 }
      )
    }

    // 格式化返回数据
    const formattedGame = {
      ...game,
      id: game._id.toString(),
      _id: undefined
    }

    return NextResponse.json(formattedGame)
  } catch (error) {
    console.error('获取游戏详情失败:', error)
    return NextResponse.json(
      { error: '获取游戏详情失败' },
      { status: 500 }
    )
  }
} 