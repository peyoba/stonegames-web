import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// 定义游戏对象的类型
interface Game {
  _id: ObjectId;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  imageUrl: string;
  gameUrl: string;
  categoryId: ObjectId;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 获取游戏列表
 * @param request 请求对象
 * @returns 游戏列表
 */
export async function GET(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // 构建查询条件
    const query: any = {}
    if (categoryId) {
      query.categoryId = new ObjectId(categoryId)
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { titleEn: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { descriptionEn: { $regex: search, $options: 'i' } }
      ]
    }

    // 获取总数
    const total = await db.collection('games').countDocuments(query)

    // 获取游戏列表
    const games = await db.collection('games')
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray() as Game[]

    // 格式化返回数据
    const formattedGames = games.map((game: Game) => {
      const { _id, ...rest } = game
      return {
        id: _id.toString(),
        ...rest
      }
    })

    return NextResponse.json({
      data: formattedGames,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('获取游戏列表失败:', error)
    return NextResponse.json(
      { error: '获取游戏列表失败' },
      { status: 500 }
    )
  }
}

/**
 * 创建新游戏
 * @param request 请求对象
 * @returns 创建的游戏信息
 */
export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()
    const {
      title,
      titleEn,
      description,
      descriptionEn,
      imageUrl,
      gameUrl,
      categoryId,
      isPublished
    } = body

    // 验证必填字段
    if (!title || !titleEn || !description || !descriptionEn || !imageUrl || !gameUrl || !categoryId) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      )
    }

    // 创建新游戏
    const newGame: Omit<Game, '_id'> = {
      title,
      titleEn,
      description,
      descriptionEn,
      imageUrl,
      gameUrl,
      categoryId: new ObjectId(categoryId),
      isPublished: isPublished || false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // 保存到数据库
    const result = await db.collection('games').insertOne(newGame)
    const insertedGame = {
      ...newGame,
      id: result.insertedId.toString()
    }

    return NextResponse.json(insertedGame)
  } catch (error) {
    console.error('创建游戏失败:', error)
    return NextResponse.json(
      { error: '创建游戏失败' },
      { status: 500 }
    )
  }
} 