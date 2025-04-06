import { NextResponse } from 'next/server'
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb'
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

// 分类接口
interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon?: string;
  count: number;
}

// 模拟分类数据
export const mockCategories: Category[] = [
  {
    id: "1",
    name: "益智游戏",
    nameEn: "Puzzle",
    icon: "🧩",
    count: 2,
  },
  {
    id: "2",
    name: "动作游戏",
    nameEn: "Action",
    icon: "🎮",
    count: 2,
  },
  {
    id: "3",
    name: "策略游戏",
    nameEn: "Strategy",
    icon: "🎲",
    count: 0,
  },
  {
    id: "4",
    name: "冒险游戏",
    nameEn: "Adventure",
    icon: "🏝️",
    count: 0,
  },
  {
    id: "5",
    name: "体育游戏",
    nameEn: "Sports",
    icon: "⚽",
    count: 0,
  }
];

/**
 * 获取所有分类
 * @param request 请求对象
 * @returns 分类列表
 */
export async function GET(request: Request) {
  try {
    // 确保MongoDB已连接
    await connectDB()
    
    // 从数据库获取分类列表
    const categories = await Category.find().lean()
    
    // 将MongoDB的_id转换为id字段
    const formattedCategories = categories.map(category => ({
      ...category,
      id: category._id.toString()
    }))
    
    return NextResponse.json(formattedCategories)
  } catch (error) {
    console.error("获取分类列表失败:", error)
    return NextResponse.json(
      { error: "获取分类列表失败" },
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
    // 确保MongoDB已连接
    await connectDB()
    
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
    const existingCategory = await Category.findOne({
      $or: [{ name }, { nameEn }]
    })
    
    if (existingCategory) {
      return NextResponse.json(
        { error: "分类名称已存在" },
        { status: 400 }
      )
    }
    
    // 创建新分类
    const newCategory = new Category({
      name,
      nameEn,
      icon,
      count: 0
    })
    
    // 保存到数据库
    await newCategory.save()
    
    return NextResponse.json(newCategory)
  } catch (error) {
    console.error("创建分类失败:", error)
    return NextResponse.json(
      { error: "创建分类失败" },
      { status: 500 }
    )
  }
} 