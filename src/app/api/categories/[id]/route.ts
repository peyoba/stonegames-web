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

// 模拟分类数据 - 只在本文件内使用，不再从外部导入
const mockCategories: Category[] = [
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
 * 验证MongoDB ObjectId的有效性
 * @param id 要验证的ID字符串
 * @returns 如果ID有效则返回true，否则返回false
 */
function isValidObjectId(id: string): boolean {
  if (!id || id === 'undefined' || id === 'null') return false;
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * 获取分类详情
 * @param request 请求对象
 * @param params 路由参数
 * @returns 分类详情
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 确保MongoDB已连接
    await connectDB()
    
    const id = params.id
    console.log("获取分类详情，ID:", id);
    
    // 验证ID格式
    if (!isValidObjectId(id)) {
      console.error("无效的分类ID:", id);
      return NextResponse.json(
        { error: "无效的分类ID" },
        { status: 400 }
      );
    }
    
    // 查找分类
    const category = await Category.findById(id).lean()
    
    if (!category) {
      return NextResponse.json(
        { error: "分类不存在" },
        { status: 404 }
      )
    }
    
    // 确保返回的分类对象包含id字段（将MongoDB的_id转换为id）
    const result = {
      ...category,
      id: (category as any)._id.toString()
    };
    
    return NextResponse.json(result)
  } catch (error) {
    console.error("获取分类详情失败:", error)
    return NextResponse.json(
      { error: "获取分类详情失败" },
      { status: 500 }
    )
  }
}

/**
 * 更新分类信息
 * @param request 请求对象
 * @param params 路由参数
 * @returns 更新后的分类信息
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 确保MongoDB已连接
    await connectDB()
    
    const id = params.id
    console.log("更新分类，ID:", id);
    
    // 验证ID格式
    if (!isValidObjectId(id)) {
      console.error("无效的分类ID:", id);
      return NextResponse.json(
        { error: "无效的分类ID" },
        { status: 400 }
      );
    }
    
    const data = await request.json()
    const { name, nameEn, icon } = data
    
    // 验证必填字段
    if (!name || !nameEn) {
      return NextResponse.json(
        { error: "分类名称不能为空" },
        { status: 400 }
      )
    }
    
    // 检查分类是否存在
    const category = await Category.findById(id)
    if (!category) {
      return NextResponse.json(
        { error: "分类不存在" },
        { status: 404 }
      )
    }
    
    // 检查名称是否重复（除了当前分类）
    const existingCategory = await Category.findOne({
      $or: [{ name }, { nameEn }],
      _id: { $ne: id }
    })
    
    if (existingCategory) {
      return NextResponse.json(
        { error: "分类名称已存在" },
        { status: 400 }
      )
    }
    
    // 更新分类
    const updateData: any = { name, nameEn }
    if (icon) updateData.icon = icon
    
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).lean()
    
    // 确保返回的分类对象包含id字段（将MongoDB的_id转换为id）
    const result = {
      ...updatedCategory,
      id: (updatedCategory as any)._id.toString()
    };
    
    return NextResponse.json(result)
  } catch (error) {
    console.error("更新分类失败:", error)
    return NextResponse.json(
      { error: "更新分类失败" },
      { status: 500 }
    )
  }
}

/**
 * 删除分类
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
    
    // 检查分类是否存在
    const category = await Category.findById(id)
    if (!category) {
      return NextResponse.json(
        { error: "分类不存在" },
        { status: 404 }
      )
    }
    
    // 检查分类是否被游戏使用
    const { db } = await connectToDatabase()
    const gamesCount = await db.collection(COLLECTIONS.GAMES).countDocuments({ categoryId: id })
    
    if (gamesCount > 0) {
      return NextResponse.json(
        { error: "该分类下仍有游戏，无法删除" },
        { status: 400 }
      )
    }
    
    // 删除分类
    await Category.findByIdAndDelete(id)
    
    return NextResponse.json({ success: true, message: "分类删除成功" })
  } catch (error) {
    console.error("删除分类失败:", error)
    return NextResponse.json(
      { error: "删除分类失败" },
      { status: 500 }
    )
  }
} 