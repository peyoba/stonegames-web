import { NextResponse } from 'next/server'
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb'
import Game from '@/models/game'
import Category from '@/models/category'
import mongoose from 'mongoose'

// 确保MongoDB连接
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
 * 首页API - 获取热门游戏和分类
 */
export async function GET() {
  try {
    // 确保MongoDB已连接
    await connectDB()
    
    // 获取游戏列表，按访问量排序
    const games = await Game.find()
      .sort({ views: -1 })
      .limit(10)
      .populate('categoryId') // 填充分类信息
      .select('id title titleEn description descriptionEn imageUrl gameUrl categoryId views likes')
      .lean()
    
    // 获取分类列表
    const categories = await Category.find().lean()
    
    // 计算分类游戏数量
    const categoryCounts = await Game.aggregate([
      { $group: { _id: "$categoryId", count: { $sum: 1 } } }
    ])
    
    // 更新分类计数
    const categoriesWithCount = categories.map(category => {
      const countInfo = categoryCounts.find(c => c._id.toString() === category._id.toString())
      return {
        ...category,
        count: countInfo ? countInfo.count : 0
      }
    })
    
    // 添加"全部游戏"分类
    const totalGamesCount = await Game.countDocuments()
    const allCategories = [
      {
        _id: "all",
        name: "全部游戏",
        nameEn: "All Games",
        count: totalGamesCount
      },
      ...categoriesWithCount
    ]
    
    // 格式化游戏数据，确保category字段存在
    const formattedGames = games.map(game => {
      // 处理MongoDB返回的数据
      // @ts-ignore - 处理MongoDB对象
      const gameId = game._id ? game._id.toString() : '';
      // @ts-ignore - 处理MongoDB对象
      const catId = game.categoryId && game.categoryId._id ? game.categoryId._id.toString() : null;
      
      // 基础游戏信息
      const formattedGame = {
        id: gameId,
        title: game.title || '',
        titleEn: game.titleEn || '',
        description: game.description || '',
        descriptionEn: game.descriptionEn || '',
        imageUrl: game.imageUrl || '',
        gameUrl: game.gameUrl || '',
        views: game.views || 0,
        likes: game.likes || 0,
        categoryId: catId,
        // 分类信息
        category: game.categoryId ? {
          // @ts-ignore - 处理MongoDB对象
          id: catId,
          // @ts-ignore - 处理MongoDB对象
          name: game.categoryId.name || "未分类",
          // @ts-ignore - 处理MongoDB对象
          nameEn: game.categoryId.nameEn || "Uncategorized"
        } : {
          id: "unknown",
          name: "未分类",
          nameEn: "Uncategorized"
        }
      };
      
      return formattedGame;
    });
    
    // 返回游戏和分类数据
    return NextResponse.json({
      games: formattedGames,
      categories: allCategories
    })
  } catch (error) {
    console.error("获取首页数据失败:", error)
    return NextResponse.json(
      { error: "获取首页数据失败" },
      { status: 500 }
    )
  }
} 