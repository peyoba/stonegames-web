"use client"

import { useAppStore } from "@/store"
import { siteConfig } from "@/config/site"
import { Github } from "lucide-react"
import Link from "next/link"

/**
 * 页脚组件
 * 显示版权信息和其他链接
 */
export function Footer() {
  const locale = useAppStore((state) => state.locale)

  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <nav
          className="-mx-5 -my-2 flex flex-wrap justify-center"
          aria-label="Footer"
        >
          <div className="px-5 py-2">
            <Link
              href="/about"
              className="text-base text-gray-500 hover:text-gray-900"
            >
              {locale === "zh" ? "关于我们" : "About"}
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link
              href="/privacy"
              className="text-base text-gray-500 hover:text-gray-900"
            >
              {locale === "zh" ? "隐私政策" : "Privacy"}
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link
              href="/terms"
              className="text-base text-gray-500 hover:text-gray-900"
            >
              {locale === "zh" ? "服务条款" : "Terms"}
            </Link>
          </div>
          <div className="px-5 py-2">
            <Link
              href="/contact"
              className="text-base text-gray-500 hover:text-gray-900"
            >
              {locale === "zh" ? "联系我们" : "Contact"}
            </Link>
          </div>
        </nav>
        <p className="mt-8 text-center text-base text-gray-400">
          &copy; {new Date().getFullYear()} Stone Games.{" "}
          {locale === "zh" ? "保留所有权利" : "All rights reserved."}
        </p>
      </div>
    </footer>
  )
} 