import { NextResponse } from "next/server"

/**
 * 简化的API路由，替代NextAuth
 * 因为我们已经切换到本地存储方案，这个API路由不再需要
 */
export async function GET() {
  console.log("NextAuth API被访问，但我们已经切换到本地存储方案")
  return NextResponse.json(
    { error: "此API已禁用，使用本地存储方案代替" },
    { status: 404 }
  )
}

export async function POST() {
  console.log("NextAuth API被访问，但我们已经切换到本地存储方案")
  return NextResponse.json(
    { error: "此API已禁用，使用本地存储方案代替" },
    { status: 404 }
  )
} 