import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// 定义分类和游戏对象的类型
interface Category {
  _id: ObjectId;
  name: string;
  nameEn: string;
  icon?: string;
  games: any[];
}

interface Game {
  _id: ObjectId;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  imageUrl: string;
  gameUrl: string;
  categoryId: ObjectId;
  tags?: string[];
  isPublished?: boolean;
  views?: number;
  likes?: number;
}

/**
 * 获取首页数据
 * @returns 首页数据
 */
export async function GET() {
  console.log('[API /api/home] 开始获取数据...')
  try {
    const { db } = await connectToDatabase()

    // 获取分类列表
    const categories = await db.collection('categories')
      .find({})
      .toArray() as Category[]
    console.log('[API /api/home] 已获取分类数据，分类数量:', categories.length)

    // 获取所有已发布的游戏
    const games = await db.collection('games')
      .find({ isPublished: true })
      .toArray() as Game[]
    console.log('[API /api/home] 已获取游戏数据，游戏数量:', games.length)

    // 计算每个分类的游戏数量
    const categoryCounts: Record<string, number> = {}
    games.forEach(game => {
      const categoryId = game.categoryId.toString()
      categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1
    })

    // 格式化分类数据，添加游戏数量
    const formattedCategories = categories.map((category: Category) => {
      const categoryId = category._id.toString()
      return {
        id: categoryId,
        name: category.name,
        nameEn: category.nameEn,
        icon: category.icon || "🎮", // 默认图标
        gameCount: categoryCounts[categoryId] || 0,
        // 找出属于这个分类的游戏
        games: games
          .filter(game => game.categoryId.toString() === categoryId)
          .map(game => ({
            id: game._id.toString(),
            title: game.title,
            titleEn: game.titleEn,
            description: game.description,
            descriptionEn: game.descriptionEn,
            imageUrl: game.imageUrl,
            gameUrl: game.gameUrl,
            categoryId: game.categoryId.toString(),
            tags: game.tags || [],
            category: {
              id: categoryId,
              name: category.name,
              nameEn: category.nameEn,
              icon: category.icon || "🎮"
            },
            views: game.views || 0,
            likes: game.likes || 0
          }))
      }
    })
    console.log('[API /api/home] 已处理分类数据，添加了游戏计数和关联游戏')

    // 格式化游戏数据，添加分类信息
    const formattedGames = games.map((game: Game) => {
      const gameId = game._id.toString()
      const categoryId = game.categoryId.toString()
      const category = categories.find(c => c._id.toString() === categoryId)
      
      return {
        id: gameId,
        title: game.title,
        titleEn: game.titleEn,
        description: game.description,
        descriptionEn: game.descriptionEn,
        imageUrl: game.imageUrl,
        gameUrl: game.gameUrl,
        categoryId: categoryId,
        tags: game.tags || [],
        category: category ? {
          id: categoryId,
          name: category.name,
          nameEn: category.nameEn,
          icon: category.icon || "🎮"
        } : null,
        views: game.views || 0,
        likes: game.likes || 0
      }
    })
    console.log('[API /api/home] 已处理游戏数据，添加了分类信息')

    const responseData = {
      categories: formattedCategories,
      games: formattedGames // 修改为与页面组件匹配的字段名
    }
    console.log('[API /api/home] 完成数据处理，返回结果')

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('[API /api/home] 获取首页数据失败:', error)
    return NextResponse.json(
      { error: '获取首页数据失败' },
      { status: 500 }
    )
  }
} 