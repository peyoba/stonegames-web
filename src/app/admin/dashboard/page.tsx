"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminHeader from "../AdminHeader";

/**
 * 管理后台仪表盘页面
 */
export default function AdminDashboardPage() {
  // 状态管理
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminName, setAdminName] = useState("管理员");

  // 确保只在客户端运行
  useEffect(() => {
    setIsClient(true);
    
    // 检查登录状态
    try {
      if (typeof window !== "undefined") {
        // 检查登录状态
        const storedAdminId = window.localStorage.getItem("adminId");
        const storedAdminName = window.localStorage.getItem("adminName");
        
        if (storedAdminId === "admin123" && storedAdminName) {
          setIsLoggedIn(true);
          setAdminName(storedAdminName);
        } else {
          // 未登录，重定向到登录页面
          window.location.href = "/admin/login";
        }
      }
    } catch (e) {
      console.error("检查登录状态出错", e);
      // 出错时重定向到登录页
      if (typeof window !== "undefined") {
        window.location.href = "/admin/login";
      }
    }
  }, []);

  // 服务器端渲染时不显示内容
  if (!isClient || !isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader adminName={adminName} />
      
      <main className="container mx-auto px-4 py-8">
        {/* 统计卡片区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">游戏总数</h3>
            <p className="text-3xl font-bold text-gray-800">12</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">分类总数</h3>
            <p className="text-3xl font-bold text-gray-800">5</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">本月访问</h3>
            <p className="text-3xl font-bold text-gray-800">4,821</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">总访问量</h3>
            <p className="text-3xl font-bold text-gray-800">28,653</p>
          </div>
        </div>
        
        {/* 快捷操作区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">游戏管理</h3>
            <p className="text-gray-600 mb-4">管理网站上的游戏，添加、编辑或删除游戏。</p>
            <Link 
              href="/admin/games"
              className="w-full inline-block text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              管理游戏
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">分类管理</h3>
            <p className="text-gray-600 mb-4">管理游戏分类，添加、编辑或删除分类。</p>
            <Link 
              href="/admin/categories"
              className="w-full inline-block text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              管理分类
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">网站设置</h3>
            <p className="text-gray-600 mb-4">管理网站的基本设置，如标题、描述和主题。</p>
            <Link 
              href="/admin/settings"
              className="w-full inline-block text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              网站设置
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 