import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

/**
 * 增加游戏点赞数
 * @param params 路由参数，包含游戏ID
 * @returns 更新结果
 */
export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase()
    
    // 检查游戏是否存在
    const game = await db.collection('games').findOne({
      _id: new ObjectId(params.id)
    })

    if (!game) {
      return NextResponse.json(
        { error: '游戏不存在' },
        { status: 404 }
      )
    }

    // 增加点赞数
    await db.collection('games').updateOne(
      { _id: new ObjectId(params.id) },
      { $inc: { likes: 1 } }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('增加游戏点赞数失败:', error)
    return NextResponse.json(
      { error: '增加游戏点赞数失败' },
      { status: 500 }
    )
  }
} 