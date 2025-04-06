"use client"

import { useAppStore } from "@/store"
import { siteConfig } from "@/config/site"
import { Link } from "@/components/ui/link"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

/**
 * 导航栏组件
 */
export function Navbar() {
  // 获取当前语言设置
  const locale = useAppStore((state) => state.locale)
  const setLocale = useAppStore((state) => state.setLocale)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">
            {siteConfig.name}
          </span>
        </Link>

        {/* 导航链接 */}
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground/80"
            >
              {locale === "zh" ? item.title : item.titleEn}
            </Link>
          ))}
        </nav>

        {/* 语言切换 */}
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
          >
            <Globe className="h-4 w-4" />
            <span className="sr-only">
              {locale === "zh" ? "切换语言" : "Toggle Language"}
            </span>
          </Button>
        </div>
      </div>
    </header>
  )
} 