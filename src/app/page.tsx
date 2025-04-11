"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/store"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import GameCard from "@/components/GameCard"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n"
import { Search, ChevronRight, Star, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

/**
 * 游戏数据接口
 */
interface Game {
  id: string
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  imageUrl: string
  categoryId: string
  category?: {
    id: string
    name: string
    nameEn: string
    icon?: string
  }
  tags?: string[]
  likes?: number
  views?: number
}

/**
 * 分类数据接口
 */
interface Category {
  id: string
  name: string
  nameEn: string
  icon?: string
  gameCount?: number
}

/**
 * 首页组件
 * 显示游戏导航网站的主页内容
 */
export default function HomePage() {
  // 获取当前语言设置
  const locale = useAppStore((state) => state.locale)
  const t = useTranslation()
  
  // 存储游戏数据和分类数据
  const [games, setGames] = useState<Game[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [initStatus, setInitStatus] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  
  // 获取首页数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/home')
        const data = await response.json()
        
        if (data.games) setGames(data.games)
        if (data.categories) setCategories(data.categories)
        setLoading(false)
      } catch (err) {
        console.error('获取数据失败:', err)
        setError('获取数据失败，请刷新页面重试')
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // 初始化数据库
  const handleInitializeDb = async () => {
    try {
      setInitStatus("正在初始化数据库...")
      const response = await fetch('/api/init')
      const data = await response.json()
      
      if (data.error) {
        setInitStatus(`初始化失败: ${data.error}`)
      } else {
        setInitStatus(`初始化成功! 分类: ${data.categories}, 游戏: ${data.games}`)
        // 重新加载数据
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      }
    } catch (err) {
      console.error('初始化数据库失败:', err)
      setInitStatus('初始化数据库失败，请检查控制台错误')
    }
  }
  
  // 搜索游戏
  const filteredGames = searchTerm.trim() 
    ? games.filter(game => {
        const title = locale.includes('zh') ? game.title : game.titleEn
        const description = locale.includes('zh') ? game.description : game.descriptionEn
        return (
          title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (game.tags && game.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
        )
      })
    : games
  
  // 判断当前语言是否为中文
  const isZhLocale = locale.includes('zh')

  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* 导航栏 */}
      <Navbar />
      
      {/* 主要内容 */}
      <main className="flex-grow">
        {/* 英雄区 */}
        <section className="relative overflow-hidden bg-indigo-600 text-white">
          {/* 背景图案 */}
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-indigo-500"></div>
            <div className="absolute top-32 -left-24 h-72 w-72 rounded-full bg-purple-500"></div>
            <div className="absolute -bottom-24 right-1/3 h-60 w-60 rounded-full bg-blue-500"></div>
          </div>
          
          <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
              <div>
                <motion.h1 
                  className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {isZhLocale ? "石头游戏平台" : "Stone Games"}
                </motion.h1>
                <motion.p 
                  className="mt-6 max-w-xl text-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {isZhLocale 
                    ? "一个简单的游戏导航网站，提供各种有趣的网页游戏，让你轻松享受游戏乐趣。"
                    : "A simple game navigation website offering various fun web games for you to enjoy easily."}
                </motion.p>
                
                {/* 搜索框 */}
                <motion.div 
                  className="mt-8 flex max-w-md rounded-md shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="relative flex flex-grow items-stretch focus-within:z-10">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Search className="h-5 w-5 text-indigo-300" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      className="block w-full rounded-l-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                      placeholder={isZhLocale ? "搜索游戏..." : "Search games..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md bg-indigo-500 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {isZhLocale ? "搜索" : "Search"}
                  </button>
                </motion.div>
              </div>
              
              <div className="hidden lg:block">
                <motion.div 
                  className="relative h-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7 }}
                >
                  <div className="absolute top-1/4 right-1/4 h-40 w-40 animate-float rounded-lg bg-indigo-400 bg-opacity-80 backdrop-blur-lg">
                    <div className="flex h-full items-center justify-center">
                      <Sparkles className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/4 h-32 w-32 animate-float rounded-lg bg-purple-400 bg-opacity-80 backdrop-blur-lg" style={{ animationDelay: '-1.5s' }}>
                    <div className="flex h-full items-center justify-center">
                      <Star className="h-10 w-10 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-1/4 right-1/3 h-36 w-36 animate-float rounded-lg bg-blue-400 bg-opacity-80 backdrop-blur-lg" style={{ animationDelay: '-0.75s' }}>
                    <div className="flex h-full items-center justify-center">
                      <div className="text-3xl font-bold text-white">2048</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
        
        {/* 分类导航 */}
        <section className="border-b border-gray-100 bg-gray-50 py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {isZhLocale ? "游戏分类" : "Categories"}
              </h2>
              <div className="flex flex-wrap gap-2">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <Link 
                      key={category.id} 
                      href={`/categories/${category.id}`}
                      className="transition-all flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-indigo-50 hover:text-indigo-600 hover:shadow"
                    >
                      {category.icon && <span className="mr-1">{category.icon}</span>}
                      {isZhLocale ? category.name : category.nameEn}
                      {category.gameCount && <span className="ml-1 text-xs text-gray-500">({category.gameCount})</span>}
                    </Link>
                  ))
                ) : (
                  <div className="rounded-full bg-white px-4 py-2 text-sm text-gray-500 shadow-sm">
                    {isZhLocale ? "暂无分类" : "No categories available"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* 游戏列表 */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {searchTerm ? (isZhLocale ? "搜索结果" : "Search Results") : (isZhLocale ? "推荐游戏" : "Featured Games")}
              </h2>
              <Link href="/games" className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
                {isZhLocale ? "查看全部" : "View all"}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            {loading ? (
              // 加载状态
              <motion.div 
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {[1, 2, 3, 4].map((num) => (
                  <motion.div 
                    key={num} 
                    className="h-64 animate-pulse rounded-lg bg-gray-100"
                    variants={itemVariants}
                  ></motion.div>
                ))}
              </motion.div>
            ) : error ? (
              // 错误状态
              <div className="rounded-lg bg-red-50 py-8 text-center text-red-500">
                {error}
              </div>
            ) : filteredGames.length > 0 ? (
              // 游戏列表
              <motion.div 
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredGames.map((game) => (
                  <motion.div key={game.id} variants={itemVariants}>
                    <GameCard game={game} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              // 空状态或无搜索结果
              <div className="rounded-lg bg-gray-50 py-12 text-center">
                {searchTerm ? (
                  <div className="text-gray-500">
                    {isZhLocale 
                      ? `未找到与"${searchTerm}"相关的游戏` 
                      : `No games found for "${searchTerm}"`}
                  </div>
                ) : (
                  <div className="text-gray-500">
                    {isZhLocale ? "暂无游戏，敬请期待" : "No games available yet, stay tuned!"}
                    
                    {/* 初始化按钮 */}
                    <div className="mt-4">
                      <button
                        onClick={handleInitializeDb}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        {isZhLocale ? "初始化示例数据" : "Initialize Sample Data"}
                      </button>
                      {initStatus && (
                        <div className="mt-2 text-sm font-medium text-indigo-600">
                          {initStatus}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      
      {/* 页脚 */}
      <Footer />
    </div>
  )
} 