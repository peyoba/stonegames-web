"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

/**
 * 认证错误页面
 */
export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  useEffect(() => {
    // 打印错误信息以便调试
    console.error("认证错误:", error)
  }, [error])

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            认证错误
          </h1>
          <p className="text-sm text-muted-foreground">
            {error === "CredentialsSignin"
              ? "邮箱或密码错误"
              : error || "登录过程中发生错误"}
          </p>
        </div>
        <Button asChild>
          <Link href="/auth/login">
            返回登录
          </Link>
        </Button>
      </div>
    </div>
  )
} 