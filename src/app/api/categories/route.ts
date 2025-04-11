import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import type { Category } from '@/types'

// 获取分类列表
export async function GET(): Promise<NextResponse> {
  try {
    const { db } = await connectToDatabase()
    const categories = await db.collection('categories').find({}).toArray()
    
    // 格式化MongoDB的_id字段为id，并删除_id字段
    const formattedCategories = categories.map((category: any) => ({
      id: category._id.toString(),
      name: category.name,
      nameEn: category.nameEn,
      games: category.games || [],
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    })) satisfies Category[]
    
    return NextResponse.json(formattedCategories)
  } catch (error) {
    console.error('获取分类列表失败:', error)
    return NextResponse.json(
      { error: '获取分类列表失败' },
      { status: 500 }
    )
  }
}

/**
 * 创建新分类
 * @param request 请求对象
 * @returns 创建的分类信息
 */
export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    
    // 解析请求数据
    const data = await request.json()
    const { name, nameEn, icon = "🎮" } = data
    
    // 验证必填字段
    if (!name || !nameEn) {
      return NextResponse.json(
        { error: "分类名称不能为空" },
        { status: 400 }
      )
    }
    
    // 检查分类名称是否已存在
    const existingCategory = await db.collection('categories').findOne({
      $or: [{ name }, { nameEn }]
    })
    
    if (existingCategory) {
      return NextResponse.json(
        { error: "分类名称已存在" },
        { status: 400 }
      )
    }
    
    // 创建新分类
    const newCategory = {
      name,
      nameEn,
      icon,
      games: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // 保存到数据库
    const result = await db.collection('categories').insertOne(newCategory)
    const insertedCategory = {
      ...newCategory,
      id: result.insertedId.toString(),
    }
    
    return NextResponse.json(insertedCategory)
  } catch (error) {
    console.error("创建分类失败:", error)
    return NextResponse.json(
      { error: "创建分类失败" },
      { status: 500 }
    )
  }
} 