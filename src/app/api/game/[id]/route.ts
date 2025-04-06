import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * 获取游戏详情
 * @param request - 请求对象
 * @param params - 路由参数
 * @returns 游戏详情数据
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 获取游戏详情
    const game = await prisma.game.findUnique({
      where: {
        id: params.id,
        published: true
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            nameEn: true
          }
        }
      }
    })

    // 如果找不到游戏，返回404
    if (!game) {
      return NextResponse.json(
        { error: '游戏不存在' },
        { status: 404 }
      )
    }

    // 更新游戏浏览次数
    await prisma.game.update({
      where: { id: params.id },
      data: { views: { increment: 1 } }
    })

    return NextResponse.json(game)
  } catch (error) {
    console.error('获取游戏详情失败:', error)
    return NextResponse.json(
      { error: '获取游戏详情失败' },
      { status: 500 }
    )
  }
} 