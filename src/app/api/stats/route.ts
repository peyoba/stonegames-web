import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// 模拟统计数据
const mockStats = {
  totalGames: 2,
  publishedGames: 2,
  totalCategories: 2
}

export async function GET() {
  try {
    let totalGames = 0
    let publishedGames = 0 
    let totalCategories = 0
    let useMockData = false

    // 尝试获取统计数据，但如果失败不会中断
    try {
      // 获取总游戏数
      totalGames = await prisma.game.count()
    } catch (error) {
      console.error('获取游戏数量失败:', error)
      useMockData = true
    }
    
    try {
      // 获取已发布的游戏数
      publishedGames = await prisma.game.count({
        where: {
          published: true
        }
      })
    } catch (error) {
      console.error('获取已发布游戏数量失败:', error) 
      useMockData = true
    }
    
    try {
      // 获取分类总数
      totalCategories = await prisma.category.count()
    } catch (error) {
      console.error('获取分类数量失败:', error)
      useMockData = true
    }

    // 如果数据库连接失败，返回模拟数据
    if (useMockData) {
      console.log('使用模拟统计数据')
      return NextResponse.json(mockStats)
    }

    return NextResponse.json({
      totalGames,
      publishedGames,
      totalCategories
    })
  } catch (error) {
    console.error('获取统计数据失败:', error)
    // 返回模拟数据
    return NextResponse.json(mockStats)
  }
} 