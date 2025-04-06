"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { useAppStore } from "@/store"
import { ArrowLeft, Expand, Minimize } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface Game {
  id: string
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  imageUrl: string
  gameUrl: string
  categoryId: string
  category: {
    id: string
    name: string
    nameEn: string
  }
}

/**
 * 游戏详情页面组件
 * @param props.params.id - 游戏ID
 * @returns 游戏详情页面组件
 */
export default function GamePage({ params }: { params: { id: string } }) {
  // 获取当前语言设置
  const locale = useAppStore((state) => state.locale)
  const router = useRouter()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // 获取游戏详情
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`/api/game/${params.id}`)
        if (!response.ok) {
          throw new Error('获取游戏详情失败')
        }
        const data = await response.json()
        setGame(data)
      } catch (error) {
        console.error('获取游戏详情失败:', error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchGame()
  }, [params.id])

  // 加载状态
  if (loading) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-primary">
            {locale === "zh" ? "加载中..." : "Loading..."}
          </h2>
        </div>
      </div>
    )
  }

  // 错误状态
  if (error || !game) {
    return (
      <div className="container py-16">
        <div className="text-center">
          <Heading level={1} className="mb-4">
            {locale === "zh" ? "游戏不存在" : "Game Not Found"}
          </Heading>
          <p className="mb-8 text-muted-foreground">
            {locale === "zh"
              ? "抱歉，您要查找的游戏不存在。"
              : "Sorry, the game you are looking for does not exist."}
          </p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {locale === "zh" ? "返回首页" : "Back to Home"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      {/* 游戏标题和返回按钮 */}
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="mb-2"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {locale === "zh" ? "返回首页" : "Back to Home"}
          </Button>
          <Heading level={1}>
            {locale === "zh" ? game.title : game.titleEn}
          </Heading>
          <p className="text-muted-foreground">
            {locale === "zh" ? game.description : game.descriptionEn}
          </p>
        </div>
        <Button variant="outline" onClick={() => setIsFullscreen(!isFullscreen)}>
          {isFullscreen ? (
            <>
              <Minimize className="mr-2 h-4 w-4" />
              {locale === "zh" ? "退出全屏" : "Exit Fullscreen"}
            </>
          ) : (
            <>
              <Expand className="mr-2 h-4 w-4" />
              {locale === "zh" ? "全屏显示" : "Fullscreen"}
            </>
          )}
        </Button>
      </div>

      {/* 游戏区域 */}
      <Card
        className={cn(
          "overflow-hidden transition-all duration-300",
          isFullscreen && "fixed inset-0 z-50 rounded-none"
        )}
      >
        <CardHeader className="border-b p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {locale === "zh" ? game.title : game.titleEn}
            </span>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {locale === "zh" ? game.category.name : game.category.nameEn}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <iframe
            src={game.gameUrl}
            className={cn(
              "h-[600px] w-full border-0",
              isFullscreen && "h-[calc(100vh-65px)]"
            )}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </CardContent>
      </Card>
    </div>
  )
} 