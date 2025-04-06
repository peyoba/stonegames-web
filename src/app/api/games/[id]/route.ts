import { NextResponse } from 'next/server'
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb'
import Game from '@/models/game'
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
 * 获取游戏详情
 * @param request 请求对象
 * @param params 路由参数
 * @returns 游戏详情
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 确保MongoDB已连接
    await connectDB()
    
    const id = params.id
    
    // 验证ID参数
    if (!id || id === 'undefined' || id === 'null') {
      return NextResponse.json(
        { error: "无效的游戏ID" },
        { status: 400 }
      )
    }
    
    // 验证是否是有效的ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "游戏ID格式不正确" },
        { status: 400 }
      )
    }
    
    // 查找游戏
    const game = await Game.findById(id).lean()
    
    if (!game) {
      return NextResponse.json(
        { error: "游戏不存在" },
        { status: 404 }
      )
    }
    
    // 增加游戏浏览量
    await Game.findByIdAndUpdate(id, { $inc: { views: 1 } })
    
    // 查询对应的分类信息
    const { db } = await connectToDatabase()
    const category = await db.collection(COLLECTIONS.CATEGORIES).findOne({ _id: game.categoryId })
    
    // 组合响应数据
    const gameWithCategory = {
      ...game,
      views: game.views + 1, // 立即更新浏览量
      category: category ? {
        id: category._id,
        name: category.name,
        nameEn: category.nameEn,
        icon: category.icon
      } : {
        id: "unknown",
        name: "未分类",
        nameEn: "Uncategorized",
        icon: "❓"
      }
    }
    
    return NextResponse.json(gameWithCategory)
  } catch (error) {
    console.error("获取游戏详情失败:", error)
    return NextResponse.json(
      { error: "获取游戏详情失败" },
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
    // 确保MongoDB已连接
    await connectDB()
    
    const id = params.id
    
    // 验证ID参数
    if (!id || id === 'undefined' || id === 'null') {
      return NextResponse.json(
        { error: "无效的游戏ID" },
        { status: 400 }
      )
    }
    
    // 验证是否是有效的ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "游戏ID格式不正确" },
        { status: 400 }
      )
    }
    
    const data = await request.json()
    const { 
      title, 
      titleEn,
      description,
      descriptionEn,
      longDescription,
      longDescriptionEn,
      imageUrl, 
      screenshots,
      gameUrl, 
      categoryId,
      releaseDate,
      developer,
      tags 
    } = data
    
    // 基础验证
    if (!title || !titleEn || !description || !descriptionEn || !imageUrl || !gameUrl || !categoryId) {
      return NextResponse.json(
        { error: "缺少必填字段" },
        { status: 400 }
      )
    }
    
    // 验证分类ID是否为有效的ObjectId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { error: "分类ID格式不正确" },
        { status: 400 }
      )
    }
    
    // 检查游戏是否存在
    const game = await Game.findById(id)
    if (!game) {
      return NextResponse.json(
        { error: "游戏不存在" },
        { status: 404 }
      )
    }
    
    try {
      // 尝试将categoryId转换为ObjectId
      const categoryObjectId = new mongoose.Types.ObjectId(categoryId);
      
      // 检查分类是否存在
      const { db } = await connectToDatabase()
      const categoryExists = await db.collection(COLLECTIONS.CATEGORIES).findOne({ _id: categoryObjectId })
      if (!categoryExists) {
        return NextResponse.json(
          { error: "指定的分类不存在" },
          { status: 400 }
        )
      }
      
      // 如果分类发生变化，需要更新计数
      if (game.categoryId.toString() !== categoryId) {
        // 减少原分类计数
        await db.collection(COLLECTIONS.CATEGORIES).updateOne(
          { _id: game.categoryId },
          { $inc: { count: -1 } }
        )
        
        // 增加新分类计数
        await db.collection(COLLECTIONS.CATEGORIES).updateOne(
          { _id: categoryObjectId },
          { $inc: { count: 1 } }
        )
      }
      
      // 更新游戏
      const updateData = {
        title,
        titleEn,
        description,
        descriptionEn,
        longDescription,
        longDescriptionEn,
        imageUrl,
        gameUrl,
        categoryId: categoryObjectId
      }
      
      if (screenshots) updateData.screenshots = screenshots
      if (releaseDate) updateData.releaseDate = releaseDate
      if (developer) updateData.developer = developer
      if (tags) updateData.tags = tags
      
      const updatedGame = await Game.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      ).lean()
      
      // 查询分类信息
      const category = await db.collection(COLLECTIONS.CATEGORIES).findOne({ _id: categoryObjectId })
      
      if (updatedGame && category) {
        return NextResponse.json({
          ...updatedGame,
          category: {
            id: category._id,
            name: category.name,
            nameEn: category.nameEn,
            icon: category.icon
          }
        })
      }
      
      return NextResponse.json(updatedGame)
    } catch (idError) {
      console.error("分类ID转换失败:", idError)
      return NextResponse.json(
        { error: "分类ID格式不正确" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("更新游戏失败:", error)
    return NextResponse.json(
      { error: "更新游戏失败" },
      { status: 500 }
    )
  }
}

/**
 * 删除游戏
 * @param request 请求对象
 * @param params 路由参数
 * @returns 删除结果
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 确保MongoDB已连接
    await connectDB()
    
    const id = params.id
    
    // 验证ID参数
    if (!id || id === 'undefined' || id === 'null') {
      return NextResponse.json(
        { error: "无效的游戏ID" },
        { status: 400 }
      )
    }
    
    // 验证是否是有效的ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "游戏ID格式不正确" },
        { status: 400 }
      )
    }
    
    // 查找游戏以获取分类ID
    const game = await Game.findById(id)
    if (!game) {
      return NextResponse.json(
        { error: "游戏不存在" },
        { status: 404 }
      )
    }
    
    // 删除游戏
    await Game.findByIdAndDelete(id)
    
    // 减少分类游戏计数
    const { db } = await connectToDatabase()
    await db.collection(COLLECTIONS.CATEGORIES).updateOne(
      { _id: game.categoryId },
      { $inc: { count: -1 } }
    )
    
    return NextResponse.json({ success: true, message: "游戏删除成功" })
  } catch (error) {
    console.error("删除游戏失败:", error)
    return NextResponse.json(
      { error: "删除游戏失败" },
      { status: 500 }
    )
  }
}

// 游戏详情接口
interface GameDetails {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  screenshots: string[];
  gameUrl: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    nameEn: string;
    icon?: string;
  };
  releaseDate: string;
  developer: string;
  tags: string[];
  likes: number;
  views: number;
}

// 模拟游戏详情数据
export const mockGameDetails: GameDetails[] = [
  {
    id: "1",
    title: "2048",
    description: "2048是一款数字组合益智游戏，由19岁的意大利人Gabriele Cirulli开发。游戏规则：玩家每次可以选择上下左右其中一个方向去滑动，每滑动一次，所有的数字方块都会往滑动的方向靠拢，系统也会在空白的地方随机出现一个2或者4的方块，相同的数字在靠拢、相撞时会相加，例如2+2=4、4+4=8、8+8=16，以此类推，最终目标是得到一个'2048'的方块。",
    imageUrl: "/images/games/2048.png",
    screenshots: [
      "/images/games/2048-1.png",
      "/images/games/2048-2.png",
      "/images/games/2048-3.png",
    ],
    gameUrl: "/games/2048",
    categoryId: "1", // 益智游戏
    releaseDate: "2014-03-09",
    developer: "Gabriele Cirulli",
    tags: ["益智", "数字", "休闲", "单人"],
    likes: 350,
    views: 1200
  },
  {
    id: "2",
    title: "贪吃蛇",
    description: "贪吃蛇是一个经典的街机游戏，玩家控制一条不断成长的蛇，在游戏区域内移动并吃食物。每当蛇吃到食物，它的身体就会变长。游戏的目标是让蛇尽可能地长，同时避免撞到墙壁或者蛇自己的身体，否则游戏就会结束。这款游戏简单但极具挑战性，考验玩家的反应速度和策略眼光。",
    imageUrl: "/images/games/snake.png",
    screenshots: [
      "/images/games/snake-1.png",
      "/images/games/snake-2.png",
      "/images/games/snake-3.png",
    ],
    gameUrl: "/games/snake",
    categoryId: "2", // 动作游戏
    releaseDate: "1976-10-01",
    developer: "Gremlin Industries",
    tags: ["经典", "街机", "动作", "单人"],
    likes: 280,
    views: 980
  },
  {
    id: "3",
    title: "俄罗斯方块",
    description: "俄罗斯方块是由俄罗斯人阿列克谢·帕基特诺夫于1984年发明的一款休闲益智游戏。在游戏中，几何形状的方块从屏幕上方落下，玩家可以旋转和移动这些方块，使它们在落到底部时能够形成完整的一行或多行。当一行被完全填满时，这一行会消失，玩家得分。游戏的目标是尽可能长时间地阻止方块堆积到顶部。",
    imageUrl: "/images/games/tetris.png",
    screenshots: [
      "/images/games/tetris-1.png",
      "/images/games/tetris-2.png",
      "/images/games/tetris-3.png",
    ],
    gameUrl: "/games/tetris",
    categoryId: "1", // 益智游戏
    releaseDate: "1984-06-06",
    developer: "Alexey Pajitnov",
    tags: ["益智", "经典", "方块", "单人"],
    likes: 420,
    views: 1500
  },
  {
    id: "4",
    title: "跳跃忍者",
    description: "跳跃忍者是一款考验反应能力和技巧的动作游戏。玩家控制一个忍者角色，通过点击屏幕使忍者从一个平台跳到另一个平台，同时躲避各种障碍物并收集金币。游戏难度会随着分数增加而提高，平台之间的距离变大，障碍物增多。这款游戏操作简单，但需要玩家有良好的反应能力和时机把握，是一款很受欢迎的手机休闲游戏。",
    imageUrl: "/images/games/ninja.png",
    screenshots: [
      "/images/games/ninja-1.png",
      "/images/games/ninja-2.png",
      "/images/games/ninja-3.png",
    ],
    gameUrl: "/games/ninja",
    categoryId: "2", // 动作游戏
    releaseDate: "2013-02-14",
    developer: "Ketchapp",
    tags: ["动作", "跳跃", "障碍", "单人"],
    likes: 230,
    views: 850
  }
]; 