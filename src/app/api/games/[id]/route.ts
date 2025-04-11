import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

/**
 * 获取单个游戏详情
 * @param request 请求对象
 * @param context 上下文对象，包含路由参数
 * @returns 游戏详情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    console.log(`[API /api/games/${id}] 获取游戏详情...`)

    // 验证ID格式
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: '无效的游戏ID' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    
    // 查询游戏详情
    const game = await db.collection('games').findOne({ 
      _id: new ObjectId(id) 
    })

    if (!game) {
      return NextResponse.json(
        { error: '找不到该游戏' },
        { status: 404 }
      )
    }

    // 增加游戏访问次数
    await db.collection('games').updateOne(
      { _id: new ObjectId(id) },
      { $inc: { views: 1 } }
    )

    // 获取分类信息
    let category = null
    if (game.categoryId) {
      category = await db.collection('categories').findOne({ 
        _id: new ObjectId(game.categoryId) 
      })
    }

    // 格式化游戏数据
    const formattedGame = {
      id: game._id.toString(),
      title: game.title,
      titleEn: game.titleEn,
      description: game.description,
      descriptionEn: game.descriptionEn,
      imageUrl: game.imageUrl,
      gameUrl: game.gameUrl,
      categoryId: game.categoryId ? game.categoryId.toString() : null,
      category: category ? {
        id: category._id.toString(),
        name: category.name,
        nameEn: category.nameEn,
        icon: category.icon || "🎮"
      } : null,
      tags: game.tags || [],
      views: (game.views || 0) + 1, // 包含当前访问
      likes: game.likes || 0,
      content: game.content || null,
      contentEn: game.contentEn || null,
    }

    console.log(`[API /api/games/${id}] 成功获取游戏详情`)
    return NextResponse.json(formattedGame)
  } catch (error) {
    console.error(`[API /api/games/${params.id}] 获取游戏详情失败:`, error)
    return NextResponse.json(
      { error: '获取游戏详情失败' },
      { status: 500 }
    )
  }
}

/**
 * 更新游戏信息
 * @param request 请求对象
 * @param params 路由参数
 * @returns 更新后的游戏信息
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // 检查游戏是否存在
    const existingGame = await db.collection('games').findOne({
      _id: new ObjectId(params.id)
    })

    if (!existingGame) {
      return NextResponse.json(
        { error: '游戏不存在' },
        { status: 404 }
      )
    }

    // 更新游戏信息
    const updateData = {
      title,
      titleEn,
      description,
      descriptionEn,
      imageUrl,
      gameUrl,
      categoryId: new ObjectId(categoryId),
      isPublished,
      updatedAt: new Date()
    }

    await db.collection('games').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )

    // 获取更新后的游戏信息
    const updatedGame = await db.collection('games').findOne({
      _id: new ObjectId(params.id)
    })

    // 格式化返回数据
    const formattedGame = {
      ...updatedGame,
      id: updatedGame._id.toString(),
      _id: undefined
    }

    return NextResponse.json(formattedGame)
  } catch (error) {
    console.error('更新游戏失败:', error)
    return NextResponse.json(
      { error: '更新游戏失败' },
      { status: 500 }
    )
  }
}

/**
 * 删除游戏
 * @param params 路由参数
 * @returns 删除结果
 */
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase()

    // 检查游戏是否存在
    const existingGame = await db.collection('games').findOne({
      _id: new ObjectId(params.id)
    })

    if (!existingGame) {
      return NextResponse.json(
        { error: '游戏不存在' },
        { status: 404 }
      )
    }

    // 删除游戏
    await db.collection('games').deleteOne({
      _id: new ObjectId(params.id)
    })

    return NextResponse.json({ message: '游戏删除成功' })
  } catch (error) {
    console.error('删除游戏失败:', error)
    return NextResponse.json(
      { error: '删除游戏失败' },
      { status: 500 }
    )
  }
} 