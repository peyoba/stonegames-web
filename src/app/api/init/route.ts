import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { COLLECTIONS } from '@/lib/mongodb'

/**
 * 初始化测试数据
 * 创建测试分类和游戏
 */
export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // 检查分类集合是否已存在
    const existingCategories = await db.collection(COLLECTIONS.CATEGORIES).find({}).toArray()
    if (existingCategories.length === 0) {
      console.log('[API /api/init] 创建示例分类数据...')
      
      const categories = [
        {
          name: '益智游戏',
          nameEn: 'Puzzle Games',
          icon: '🧩',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: '休闲游戏',
          nameEn: 'Casual Games',
          icon: '🎮',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: '动作游戏',
          nameEn: 'Action Games',
          icon: '🏃',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: '策略游戏',
          nameEn: 'Strategy Games',
          icon: '🧠',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: '最新游戏',
          nameEn: 'Latest Games',
          icon: '🔥',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      const categoryResult = await db.collection(COLLECTIONS.CATEGORIES).insertMany(categories)
      console.log(`[API /api/init] 已插入 ${categoryResult.insertedCount} 个分类`)
      const insertedCategories = await db.collection(COLLECTIONS.CATEGORIES).find({}).toArray()

      // 检查游戏集合是否已存在
      const existingGames = await db.collection(COLLECTIONS.GAMES).find({}).toArray()
      if (existingGames.length === 0) {
        console.log('[API /api/init] 创建示例游戏数据...')

        // 获取已创建的分类ID
        const puzzleCategoryId = insertedCategories.find((c: { name: string; _id: string }) => c.name === '益智游戏')?._id
        const casualCategoryId = insertedCategories.find((c: { name: string; _id: string }) => c.name === '休闲游戏')?._id
        const actionCategoryId = insertedCategories.find((c: { name: string; _id: string }) => c.name === '动作游戏')?._id
        const strategyCategoryId = insertedCategories.find((c: { name: string; _id: string }) => c.name === '策略游戏')?._id

        const games = [
          {
            title: '数独挑战',
            titleEn: 'Sudoku Challenge',
            description: '经典数独游戏，锻炼你的逻辑思维能力。',
            descriptionEn: 'Classic Sudoku game to train your logical thinking.',
            imageUrl: 'https://placehold.co/600x400/9EA8F2/FFFFFF?text=Sudoku',
            gameUrl: 'https://sudoku.com',
            categoryId: puzzleCategoryId,
            tags: ['数独', '益智', '逻辑'],
            isPublished: true,
            views: 1250,
            likes: 342,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            title: '跳跃方块',
            titleEn: 'Jumping Cube',
            description: '简单有趣的休闲游戏，点击屏幕让方块跳跃并避开障碍物。',
            descriptionEn: 'Simple and fun casual game. Tap to make the cube jump and avoid obstacles.',
            imageUrl: 'https://placehold.co/600x400/F2C49E/FFFFFF?text=Jumping+Cube',
            gameUrl: 'https://example.com/jumping-cube',
            categoryId: casualCategoryId,
            tags: ['休闲', '跳跃', '简单'],
            isPublished: true,
            views: 986,
            likes: 251,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            title: '忍者冒险',
            titleEn: 'Ninja Adventure',
            description: '快节奏的动作游戏，控制忍者角色收集金币并打败敌人。',
            descriptionEn: 'Fast-paced action game. Control a ninja to collect coins and defeat enemies.',
            imageUrl: 'https://placehold.co/600x400/9EF2D9/333333?text=Ninja+Adventure',
            gameUrl: 'https://example.com/ninja-adventure',
            categoryId: actionCategoryId,
            tags: ['动作', '忍者', '冒险'],
            isPublished: true,
            views: 1568,
            likes: 487,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            title: '王国防卫',
            titleEn: 'Kingdom Defense',
            description: '经典塔防游戏，建造防御塔保卫你的王国免受怪物侵袭。',
            descriptionEn: 'Classic tower defense game. Build towers to protect your kingdom from monsters.',
            imageUrl: 'https://placehold.co/600x400/F29E9E/FFFFFF?text=Kingdom+Defense',
            gameUrl: 'https://example.com/kingdom-defense',
            categoryId: strategyCategoryId,
            tags: ['策略', '塔防', '王国'],
            isPublished: true,
            views: 2104,
            likes: 695,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]

        const gameResult = await db.collection(COLLECTIONS.GAMES).insertMany(games)
        console.log(`[API /api/init] 已插入 ${gameResult.insertedCount} 个游戏`)
      } else {
        console.log(`[API /api/init] 游戏集合已存在，包含 ${existingGames.length} 个游戏`)
      }
    } else {
      console.log(`[API /api/init] 分类集合已存在，包含 ${existingCategories.length} 个分类`)
    }

    return NextResponse.json({ 
      message: '初始化完成',
      categories: await db.collection(COLLECTIONS.CATEGORIES).countDocuments(),
      games: await db.collection(COLLECTIONS.GAMES).countDocuments()
    })
  } catch (error) {
    console.error('[API /api/init] 初始化数据库失败:', error)
    return NextResponse.json(
      { error: '初始化数据库失败' },
      { status: 500 }
    )
  }
} 