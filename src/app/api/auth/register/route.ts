import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"

/**
 * 用户注册API
 * @param request 请求对象
 * @returns 注册结果
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    // 验证必填字段
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "请填写所有必填字段" },
        { status: 400 }
      )
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "该邮箱已被注册" },
        { status: 400 }
      )
    }

    // 加密密码
    const hashedPassword = await hash(password, 12)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "USER", // 默认角色
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    return NextResponse.json({
      message: "注册成功",
      user,
    })
  } catch (error) {
    console.error("注册失败:", error)
    return NextResponse.json(
      { error: "注册失败" },
      { status: 500 }
    )
  }
} 