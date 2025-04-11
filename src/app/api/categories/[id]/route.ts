import { NextResponse, NextRequest } from 'next/server'
import Category from '@/models/category'
import mongoose from 'mongoose'
import { connectToDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// 分类接口
interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon?: string;
  count: number;
}

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
 * @param _request 请求对象 (使用 NextRequest)
 * @param params 路由参数
 * @returns 分类详情
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase()
    const category = await db.collection('categories').findOne({
      _id: new ObjectId(params.id)
    })

    if (!category) {
      return NextResponse.json(
        { error: '分类不存在' },
        { status: 404 }
      )
    }

    // 格式化返回数据
    const formattedCategory = {
      ...category,
      id: category._id.toString(),
      _id: undefined
    }

    return NextResponse.json(formattedCategory)
  } catch (error) {
    console.error('获取分类详情失败:', error)
    return NextResponse.json(
      { error: '获取分类详情失败' },
      { status: 500 }
    )
  }
}

/**
 * 更新分类信息
 * @param request 请求对象 (使用 NextRequest)
 * @param params 路由参数
 * @returns 更新后的分类信息
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
 * @param _request 请求对象 (使用 NextRequest)
 * @param params 路由参数
 * @returns 删除结果
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    console.log("删除分类，ID:", id);
    
    // 验证ID格式
    if (!isValidObjectId(id)) {
      console.error("无效的分类ID:", id);
      return NextResponse.json(
        { error: "无效的分类ID" },
        { status: 400 }
      );
    }
    
    // 检查分类是否存在
    const category = await Category.findById(id)
    if (!category) {
      return NextResponse.json(
        { error: "分类不存在" },
        { status: 404 }
      )
    }
    
    // 删除分类
    await Category.findByIdAndDelete(id)
    
    return NextResponse.json({ message: "分类删除成功" })
  } catch (error) {
    console.error("删除分类失败:", error)
    return NextResponse.json(
      { error: "删除分类失败" },
      { status: 500 }
    )
  }
} 