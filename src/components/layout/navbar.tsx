"use client"

import Link from "next/link"
import { useAppStore } from "@/store"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { Menu, X, Gamepad2, Search, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

/**
 * 导航栏组件
 * 包含网站导航和语言切换功能
 */
export function Navbar() {
  const locale = useAppStore((state) => state.locale)
  const isZhLocale = locale.includes('zh')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  
  // 监听滚动事件，控制导航栏背景
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [scrolled])

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-md'
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* 左侧 Logo 和导航链接 */}
          <div className="flex items-center">
            {/* 网站Logo */}
            <Link href="/" className="flex items-center">
              <div className="mr-2 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 transition-transform hover:scale-110">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Stone Games</span>
            </Link>

            {/* 桌面端导航 */}
            <div className="hidden md:ml-10 md:flex md:items-center md:space-x-8">
              <NavLink href="/" label={isZhLocale ? '首页' : 'Home'} />
              
              <div className="relative group">
                <button className="group flex items-center rounded-md px-2 py-1 font-medium text-gray-500 transition-colors hover:text-indigo-600">
                  {isZhLocale ? '游戏' : 'Games'}
                  <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
                </button>
                
                {/* 下拉菜单 */}
                <div className="absolute left-0 mt-1 hidden w-48 rounded-md bg-white py-2 shadow-lg ring-1 ring-black/5 group-hover:block">
                  <Link 
                    href="/games" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    {isZhLocale ? '所有游戏' : 'All Games'}
                  </Link>
                  <Link 
                    href="/games/new" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    {isZhLocale ? '最新游戏' : 'New Games'}
                  </Link>
                  <Link 
                    href="/games/popular" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    {isZhLocale ? '热门游戏' : 'Popular Games'}
                  </Link>
                </div>
              </div>
              
              <NavLink href="/categories" label={isZhLocale ? '分类' : 'Categories'} />
              <NavLink href="/about" label={isZhLocale ? '关于' : 'About'} />
            </div>
          </div>

          {/* 右侧功能区 */}
          <div className="flex items-center space-x-1">
            {/* 搜索按钮 */}
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
              aria-label={isZhLocale ? "搜索" : "Search"}
            >
              <Search className="h-5 w-5" />
            </button>
            
            {/* 搜索框 */}
            {showSearch && (
              <motion.div 
                className="absolute left-0 right-0 top-16 bg-white p-4 shadow-md"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="mx-auto flex max-w-xl items-center rounded-md border border-gray-300">
                  <input 
                    type="text" 
                    placeholder={isZhLocale ? "搜索游戏..." : "Search games..."}
                    className="w-full rounded-l-md border-0 py-2 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button className="rounded-r-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500">
                    {isZhLocale ? "搜索" : "Search"}
                  </button>
                </div>
              </motion.div>
            )}
            
            {/* 语言切换 */}
            <LanguageSwitcher />
            
            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <button
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      {mobileMenuOpen && (
        <motion.div 
          className="md:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="space-y-1 px-2 pb-3 pt-2">
            <MobileNavLink href="/" label={isZhLocale ? '首页' : 'Home'} />
            <MobileNavLink href="/games" label={isZhLocale ? '游戏' : 'Games'} />
            <MobileNavLink href="/categories" label={isZhLocale ? '分类' : 'Categories'} />
            <MobileNavLink href="/about" label={isZhLocale ? '关于' : 'About'} />
          </div>
        </motion.div>
      )}
    </nav>
  )
}

// 桌面端导航链接组件
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group relative rounded-md px-2 py-1 font-medium text-gray-500 transition-colors hover:text-indigo-600"
    >
      {label}
      <span className="absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-indigo-600 transition-all group-hover:w-full"></span>
    </Link>
  )
}

// 移动端导航链接组件
function MobileNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
    >
      {label}
    </Link>
  )
} 