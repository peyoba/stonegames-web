"use client"

import { useEffect, useState } from 'react'
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { PlaceholderImage } from "@/components/ui/placeholder-image"
import { useAppStore } from "@/store"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Menu, X, Globe, ArrowUpRight, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
  nameEn: string
  count: number
}

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

// 添加模拟数据，以防数据库连接失败
const mockGames = [
  {
    id: "1",
    title: "2048",
    titleEn: "2048",
    description: "经典的数字益智游戏",
    descriptionEn: "Classic number puzzle game",
    imageUrl: "/images/2048.png",
    gameUrl: "https://play2048.co/",
    categoryId: "1",
    category: {
      id: "1",
      name: "益智游戏",
      nameEn: "Puzzle",
    },
  },
  {
    id: "2",
    title: "贪吃蛇",
    titleEn: "Snake",
    description: "经典的贪吃蛇游戏",
    descriptionEn: "Classic snake game",
    imageUrl: "/images/snake.png",
    gameUrl: "https://playsnake.org/",
    categoryId: "1",
    category: {
      id: "1",
      name: "益智游戏",
      nameEn: "Puzzle",
    },
  },
  {
    id: "3",
    title: "俄罗斯方块",
    titleEn: "Tetris",
    description: "经典的俄罗斯方块游戏",
    descriptionEn: "Classic tetris game",
    imageUrl: "/images/tetris.png",
    gameUrl: "https://tetris.com/play-tetris",
    categoryId: "2",
    category: {
      id: "2",
      name: "动作游戏",
      nameEn: "Action",
    },
  },
  {
    id: "4",
    title: "跳跃忍者",
    titleEn: "Jumping Ninja",
    description: "考验反应能力的跳跃游戏",
    descriptionEn: "Test your reaction in this jumping game",
    imageUrl: "/images/ninja.png",
    gameUrl: "https://www.crazygames.com/game/ninja-jump",
    categoryId: "2",
    category: {
      id: "2",
      name: "动作游戏",
      nameEn: "Action",
    },
  },
]

const mockCategories = [
  {
    id: "all",
    name: "全部游戏",
    nameEn: "All Games",
    count: 4,
  },
  {
    id: "1",
    name: "益智游戏",
    nameEn: "Puzzle",
    count: 2,
  },
  {
    id: "2",
    name: "动作游戏",
    nameEn: "Action",
    count: 2,
  },
]

/**
 * 首页组件
 * 显示游戏列表和分类导航
 */
export default function HomePage() {
  // 获取当前语言设置
  const locale = useAppStore((state) => state.locale)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [error, setError] = useState(false)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  // 加载首页数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('开始获取首页数据')
        const response = await fetch('/api/home')
        const data = await response.json()
        
        // 如果从API获取的数据为空，使用模拟数据
        if (data.categories && data.categories.length > 0) {
          // 添加"全部"分类
          const allCategory = {
            id: "all",
            name: "全部游戏",
            nameEn: "All Games",
            count: data.games.length || 0
          }
          setCategories([allCategory, ...data.categories])
        } else {
          console.log('使用模拟分类数据')
          setCategories(mockCategories)
        }
        
        if (data.games && data.games.length > 0) {
          setGames(data.games)
        } else {
          console.log('使用模拟游戏数据')
          setGames(mockGames)
        }
      } catch (error) {
        console.error('获取首页数据失败:', error)
        setError(true)
        // 使用模拟数据作为后备
        setCategories(mockCategories)
        setGames(mockGames)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 处理图片加载错误
  const handleImageError = (gameId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [gameId]: true
    }))
  }

  // 过滤游戏列表
  const filteredGames = games?.length 
    ? games.filter(game => {
        // 搜索过滤
        const query = searchQuery.toLowerCase()
        const matchesSearch = 
          game.title.toLowerCase().includes(query) ||
          game.titleEn.toLowerCase().includes(query) ||
          game.description.toLowerCase().includes(query) ||
          game.descriptionEn.toLowerCase().includes(query)
        
        // 分类过滤
        const matchesCategory = selectedCategory === "all" || game.categoryId === selectedCategory
        
        return matchesSearch && matchesCategory
      })
    : []

  // 加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-xl font-semibold text-primary">
              {locale === "zh" ? "加载中..." : "Loading..."}
            </h2>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20">
      {/* 顶部导航栏 */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Stone Games
              </Link>
            </div>

            {/* 桌面端导航 */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder={locale === "zh" ? "搜索游戏..." : "Search games..."}
                  className="pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  useAppStore.setState({
                    locale: locale === "zh" ? "en" : "zh",
                  })
                }
              >
                <Globe className="h-5 w-5" />
              </Button>
              <Link href="/admin/login">
                <Button variant="default">
                  {locale === "zh" ? "管理员登录" : "Admin Login"}
                </Button>
              </Link>
            </div>

            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* 移动端菜单 */}
        <div
          className={cn(
            "md:hidden",
            "transition-all duration-300 ease-in-out",
            mobileMenuOpen ? "max-h-96" : "max-h-0 overflow-hidden"
          )}
        >
          <div className="px-4 py-2 space-y-4 bg-white/80 backdrop-blur-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder={locale === "zh" ? "搜索游戏..." : "Search games..."}
                className="pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                className="w-full mr-2"
                onClick={() =>
                  useAppStore.setState({
                    locale: locale === "zh" ? "en" : "zh",
                  })
                }
              >
                <Globe className="h-5 w-5 mr-2" />
                {locale === "zh" ? "Switch to English" : "切换到中文"}
              </Button>
              <Link href="/admin/login" className="w-full ml-2">
                <Button variant="default" className="w-full">
                  {locale === "zh" ? "管理员登录" : "Admin Login"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {locale === "zh" ? "石头游戏平台" : "Stone Games Platform"}
          </h1>
          <p className="mt-2 text-gray-600">
            {locale === "zh" ? "探索各种有趣的网页游戏" : "Explore various fun web games"}
          </p>
        </div>

        {/* 分类选择器 */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button 
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="mb-2"
            >
              {locale === "zh" ? category.name : category.nameEn}
              <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                {category.count}
              </span>
            </Button>
          ))}
        </div>

        {/* 游戏列表 */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <div key={game.id} className="group">
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <div className="relative aspect-video overflow-hidden">
                    {imageErrors[game.id] ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <PlaceholderImage className="w-16 h-16 text-gray-400" />
                      </div>
                    ) : (
                      <img
                        src={game.imageUrl}
                        alt={locale === "zh" ? game.title : game.titleEn}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={() => handleImageError(game.id)}
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-white font-bold truncate">
                        {locale === "zh" ? game.title : game.titleEn}
                      </h3>
                      <div className="flex items-center">
                        <span className="text-xs text-white/80 px-2 py-0.5 bg-primary/30 backdrop-blur-sm rounded-full">
                          {locale === "zh" ? game.category?.name || "未分类" : game.category?.nameEn || "Uncategorized"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
                      {locale === "zh" ? game.description : game.descriptionEn}
                    </p>
                    <div className="flex justify-between items-center">
                      <Link href={`/games/${game.id}`}>
                        <Button variant="outline" size="sm" className="text-xs">
                          <Info className="h-3 w-3 mr-1" />
                          {locale === "zh" ? "详情" : "Details"}
                        </Button>
                      </Link>
                      <a href={game.gameUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="text-xs">
                          {locale === "zh" ? "开始游戏" : "Play"}
                          <ArrowUpRight className="h-3 w-3 ml-1" />
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <PlaceholderImage className="w-20 h-20 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold">
              {locale === "zh" ? "没有找到游戏" : "No games found"}
            </h3>
            <p className="mt-2 text-gray-600">
              {locale === "zh" 
                ? "尝试调整搜索词或选择不同的分类" 
                : "Try adjusting your search or selecting a different category"}
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
              }}
            >
              {locale === "zh" ? "清除筛选" : "Clear filters"}
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
} 