"use client"

import { useAppStore } from "@/store"
import Link from "next/link"
import { LockKeyhole, Mail, Phone, MapPin, Heart } from "lucide-react"

/**
 * 页脚组件
 * 显示版权信息和其他链接
 */
export function Footer() {
  const locale = useAppStore((state) => state.locale)
  const isZhLocale = locale.includes('zh')

  return (
    <footer className="bg-gray-50 pt-12 pb-6 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 页脚主要内容 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* 关于我们 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm mr-2">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              Stone Games
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {isZhLocale 
                ? "石头游戏平台提供各种有趣的网页游戏，让您随时随地享受游戏的乐趣。" 
                : "Stone Games Platform offers various fun web games for you to enjoy anytime, anywhere."}
            </p>
          </div>
          
          {/* 快速链接 */}
          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-4 border-l-4 border-indigo-500 pl-3">
              {isZhLocale ? "快速链接" : "Quick Links"}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-indigo-600 transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  {isZhLocale ? "关于我们" : "About"}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-indigo-600 transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  {isZhLocale ? "隐私政策" : "Privacy"}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-600 hover:text-indigo-600 transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  {isZhLocale ? "服务条款" : "Terms"}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* 联系方式 */}
          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-4 border-l-4 border-indigo-500 pl-3">
              {isZhLocale ? "联系我们" : "Contact Us"}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2 text-indigo-500" />
                <span>contact@stonegames.com</span>
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2 text-indigo-500" />
                <span>+86 123 4567 8901</span>
              </li>
              <li className="flex items-start text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-indigo-500 mt-0.5" />
                <span>{isZhLocale ? "中国北京市朝阳区" : "Chaoyang District, Beijing, China"}</span>
              </li>
            </ul>
          </div>
          
          {/* 管理入口 */}
          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-4 border-l-4 border-indigo-500 pl-3">
              {isZhLocale ? "管理入口" : "Admin"}
            </h3>
            <Link
              href="/admin"
              className="flex items-center text-sm text-gray-600 hover:text-indigo-600 transition-colors p-3 rounded-lg border border-dashed border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
            >
              <LockKeyhole className="h-4 w-4 mr-2 text-indigo-500" />
              {isZhLocale ? "管理员登录" : "Admin Login"}
            </Link>
          </div>
        </div>
        
        {/* 分隔线 */}
        <div className="border-t border-gray-200 my-6"></div>
        
        {/* 版权信息 */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Stone Games.{" "}
            {isZhLocale ? "保留所有权利" : "All rights reserved."}
          </p>
          
          <p className="text-sm text-gray-500 mt-2 md:mt-0 flex items-center">
            <span>{isZhLocale ? "用" : "Made with"}</span>
            <Heart className="h-3 w-3 mx-1 text-red-500 fill-red-500" />
            <span>{isZhLocale ? "制作" : "in China"}</span>
          </p>
        </div>
      </div>
    </footer>
  )
} 