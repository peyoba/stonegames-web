"use client"

import { useAppStore } from "@/store"
import { Globe } from "lucide-react"
import { motion } from "framer-motion"

/**
 * 获取本地化的语言名称
 * @param locale 语言代码
 * @returns 语言名称
 */
function getLocaleName(locale: string): string {
  const normalizedLocale = locale.toLowerCase()
  return normalizedLocale.includes('zh') ? '中文' : 'English'
}

/**
 * 语言切换器组件
 * 允许用户在中文和英文之间切换
 */
export function LanguageSwitcher() {
  const locale = useAppStore((state) => state.locale)
  const setLocale = useAppStore((state) => state.setLocale)
  
  // 切换语言
  const toggleLocale = () => {
    const newLocale = locale.includes('zh') ? 'en-US' : 'zh-CN'
    setLocale(newLocale)
  }
  
  return (
    <div className="relative inline-block text-left">
      <motion.button 
        onClick={toggleLocale}
        className="flex items-center rounded-full p-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="切换语言"
      >
        <Globe className="mr-1 h-5 w-5 text-indigo-500" />
        <span className="hidden md:inline-block">{getLocaleName(locale)}</span>
      </motion.button>
    </div>
  )
} 