import { NextResponse } from 'next/server'
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb'
import Game from '@/models/game'
import mongoose from 'mongoose'

// 确保MongoDB连接 - 这可能在开发环境中需要
let isConnected = false
const connectDB = async () => {
  if (isConnected) return
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stonegames')
    isConnected = true
    console.log('MongoDB连接成功')
  } catch (error) {
    console.error('MongoDB连接失败:', error)
  }
}

/**
 * 获取游戏列表
 * @param request 请求对象
 * @returns 游戏列表
 */
export async function GET(request: Request) {
  try {
    // 确保MongoDB已连接
    await connectDB()

    // 获取查询参数
    const url = new URL(request.url)
    const categoryId = url.searchParams.get("categoryId")
    const search = url.searchParams.get("search")
    const sortBy = url.searchParams.get("sortBy") || "views" // 默认按浏览量排序
    
    // 构建查询条件
    const query: any = {}
    if (categoryId) {
      query.categoryId = categoryId
    }
    
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search, 'i')
      query.$or = [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } }
      ]
    }
    
    // 构建排序条件
    const sort: any = {}
    if (sortBy === "views") {
      sort.views = -1
    } else if (sortBy === "likes") {
      sort.likes = -1
    } else if (sortBy === "title") {
      sort.title = 1
    }
    
    // 查询数据库
    const games = await Game.find(query)
      .sort(sort)
      .select('_id title titleEn description descriptionEn imageUrl gameUrl categoryId views likes')
      .lean()
    
    // 格式化游戏数据，确保id字段存在
    const formattedGames = games.map(game => {
      // 将_id格式化为id字段
      const { _id, ...rest } = game;
      return {
        id: _id.toString(), // 确保id是字符串
        ...rest
      };
    });
    
    return NextResponse.json(formattedGames)
  } catch (error) {
    console.error("获取游戏列表失败:", error)
    return NextResponse.json(
      { error: "获取游戏列表失败" },
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
    // 确保MongoDB已连接
    await connectDB()
    
    // 解析请求数据
    const data = await request.json()
    const { 
      title, 
      titleEn,
      description,
      descriptionEn,
      longDescription,
      longDescriptionEn,
      imageUrl, 
      gameUrl, 
      categoryId,
      screenshots = [],
      releaseDate = new Date().toISOString().split('T')[0],
      developer = "未知开发者",
      tags = []
    } = data
    
    // 验证必填字段
    if (!title || !titleEn || !description || !descriptionEn || !imageUrl || !gameUrl || !categoryId) {
      return NextResponse.json(
        { error: "缺少必填字段" },
        { status: 400 }
      )
    }
    
    try {
      // 尝试将categoryId转换为ObjectId
      const objectId = new mongoose.Types.ObjectId(categoryId);
      
      // 创建新游戏
      const newGame = new Game({
        title,
        titleEn,
        description,
        descriptionEn,
        longDescription,
        longDescriptionEn,
        imageUrl,
        screenshots: screenshots.length > 0 ? screenshots : [imageUrl],
        gameUrl,
        categoryId: objectId,
        releaseDate,
        developer,
        tags,
        likes: 0,
        views: 0
      })
      
      // 保存到数据库
      await newGame.save()
      
      // 更新分类游戏计数
      const { db } = await connectToDatabase()
      await db.collection(COLLECTIONS.CATEGORIES).updateOne(
        { _id: objectId },
        { $inc: { count: 1 } }
      )
      
      // 查询分类信息
      const category = await db.collection(COLLECTIONS.CATEGORIES).findOne({ _id: objectId })
      
      if (category) {
        return NextResponse.json({
          ...newGame.toObject(),
          category: {
            id: category._id,
            name: category.name,
            nameEn: category.nameEn,
            icon: category.icon
          }
        })
      }
      
      return NextResponse.json(newGame)
    } catch (idError) {
      console.error("无效的分类ID:", idError)
      return NextResponse.json(
        { error: "无效的分类ID" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("创建游戏失败:", error)
    return NextResponse.json(
      { error: "创建游戏失败" },
      { status: 500 }
    )
  }
} 