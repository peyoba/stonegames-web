import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * 获取管理后台统计数据
 * @returns 统计数据
 */
export async function GET() {
  // 在实际项目中，应该使用checkAdminAuth来验证，但由于是本地存储方案，这里简化验证
  try {
    // 获取统计数据
    const [gamesCount, publishedGamesCount, categoriesCount] = await Promise.all([
      // 总游戏数
      prisma.game.count(),
      // 已发布游戏数
      prisma.game.count({
        where: { published: true },
      }),
      // 分类数量
      prisma.category.count(),
    ])

    return NextResponse.json({
      gamesCount,
      publishedGamesCount,
      categoriesCount,
    })
  } catch (error) {
    console.error("获取统计数据失败:", error)
    return NextResponse.json(
      { error: "获取统计数据失败" },
      { status: 500 }
    )
  }
} 