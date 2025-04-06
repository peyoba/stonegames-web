import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectToDatabase, COLLECTIONS } from '@/lib/mongodb'

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

// 网络设置接口
interface NetworkSettings {
  siteUrl: string;
  apiUrl: string;
  cdnUrl: string;
  allowCors: boolean;
  requestTimeout: number;
  maxUploadSize: number;
  proxyEnabled: boolean;
  proxyUrl: string;
}

// 默认网络设置
const defaultNetworkSettings: NetworkSettings = {
  siteUrl: "https://stonegames.example.com",
  apiUrl: "https://api.stonegames.example.com",
  cdnUrl: "https://cdn.stonegames.example.com",
  allowCors: true,
  requestTimeout: 5000,
  maxUploadSize: 5,
  proxyEnabled: false,
  proxyUrl: ""
};

/**
 * 获取网络设置
 * @param request 请求对象
 * @returns 网络设置
 */
export async function GET(request: Request) {
  try {
    // 确保MongoDB已连接
    await connectDB()
    
    // 从数据库获取网络设置
    const { db } = await connectToDatabase()
    const networkSettings = await db.collection(COLLECTIONS.SETTINGS).findOne({ type: 'network' })
    
    if (!networkSettings) {
      // 如果没有找到设置，返回默认设置
      return NextResponse.json(defaultNetworkSettings)
    }
    
    return NextResponse.json(networkSettings.data)
  } catch (error) {
    console.error("获取网络设置失败:", error)
    return NextResponse.json(
      { error: "获取网络设置失败" },
      { status: 500 }
    )
  }
}

/**
 * 更新网络设置
 * @param request 请求对象
 * @returns 更新结果
 */
export async function PUT(request: Request) {
  try {
    // 确保MongoDB已连接
    await connectDB()
    
    // 解析请求数据
    const data = await request.json()
    
    // 验证必填字段
    if (!data.siteUrl) {
      return NextResponse.json(
        { error: "网站URL不能为空" },
        { status: 400 }
      )
    }
    
    // 更新网络设置
    const { db } = await connectToDatabase()
    const result = await db.collection(COLLECTIONS.SETTINGS).updateOne(
      { type: 'network' },
      { 
        $set: { 
          data,
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    )
    
    return NextResponse.json({ 
      success: true, 
      message: "网络设置更新成功",
      result
    })
  } catch (error) {
    console.error("更新网络设置失败:", error)
    return NextResponse.json(
      { error: "更新网络设置失败" },
      { status: 500 }
    )
  }
} 