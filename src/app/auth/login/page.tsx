"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

// 参数获取组件
function LoginParamsHandler({ children }: { children: (callbackUrl: string) => React.ReactNode }) {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  return <>{children(callbackUrl)}</>
}

/**
 * 登录页面组件
 * 使用本地存储代替NextAuth
 */
export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  // 处理登录表单提交
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, callbackUrl: string) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      // 简单验证
      if (email === "admin@stonegames.com" && password === "admin123") {
        // 保存登录状态到本地存储
        if (typeof window !== "undefined") {
          window.localStorage.setItem("admin_logged_in", "true")
          window.localStorage.setItem("admin_email", email)
          window.localStorage.setItem("admin_name", "管理员")
        }
        
        toast({
          title: "登录成功",
          description: "欢迎回来！",
        })
        router.push(callbackUrl)
        router.refresh()
      } else {
        toast({
          title: "登录失败",
          description: "邮箱或密码错误",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("登录错误:", error)
      toast({
        title: "登录失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Suspense fallback={<div>加载中...</div>}>
      <LoginParamsHandler>
        {(callbackUrl) => (
          <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
              <div className="absolute inset-0 bg-zinc-900" />
              <div className="relative z-20 flex items-center text-lg font-medium">
                Stone Games
              </div>
              <div className="relative z-20 mt-auto">
                <blockquote className="space-y-2">
                  <p className="text-lg">
                    欢迎来到 Stone Games 管理后台
                  </p>
                </blockquote>
              </div>
            </div>
            <div className="lg:p-8">
              <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    管理员登录
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    请输入您的邮箱和密码
                  </p>
                </div>
                <form onSubmit={(e) => handleSubmit(e, callbackUrl)} className="space-y-4">
                  <div className="grid gap-2">
                    <Input
                      id="email"
                      name="email"
                      placeholder="admin@stonegames.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={loading}
                      required
                    />
                    <Input
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      type="password"
                      autoComplete="current-password"
                      disabled={loading}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "登录中..." : "登录"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
      </LoginParamsHandler>
    </Suspense>
  )
} 