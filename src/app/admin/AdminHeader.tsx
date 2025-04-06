"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, Package, FolderTree, LogOut, Globe, Network } from "lucide-react";

/**
 * 管理后台顶部导航组件
 */
interface AdminHeaderProps {
  adminName?: string;
}

export default function AdminHeader({ adminName: propAdminName }: AdminHeaderProps) {
  const [adminName, setAdminName] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  // 确保只在客户端运行
  useEffect(() => {
    setIsClient(true);
    // 如果没有传入adminName，则从localStorage获取
    if (!propAdminName) {
      // 获取管理员姓名
      const storedName = localStorage.getItem("adminName");
      if (storedName) {
        setAdminName(storedName);
      }
    }
    
    // 检查登录状态
    const adminId = localStorage.getItem("adminId");
    if (adminId !== "admin123") {
      window.location.href = "/admin/login";
    }
  }, [propAdminName]);

  // 处理登出
  const handleLogout = () => {
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
    window.location.href = "/admin/login";
  };

  // 服务器端渲染时不显示内容
  if (!isClient) {
    return null;
  }

  // 优先使用传入的adminName，其次使用state中的值，最后使用默认值
  const displayName = propAdminName || adminName || "管理员";

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="text-xl font-bold text-primary mr-8">
              石头游戏管理后台
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link href="/admin/dashboard" className="px-3 py-2 rounded-md hover:bg-gray-100 flex items-center">
                <Home className="w-4 h-4 mr-1" />
                <span>首页</span>
              </Link>
              <Link href="/admin/games" className="px-3 py-2 rounded-md hover:bg-gray-100 flex items-center">
                <Package className="w-4 h-4 mr-1" />
                <span>游戏管理</span>
              </Link>
              <Link href="/admin/categories" className="px-3 py-2 rounded-md hover:bg-gray-100 flex items-center">
                <FolderTree className="w-4 h-4 mr-1" />
                <span>分类管理</span>
              </Link>
              <Link href="/admin/settings" className="px-3 py-2 rounded-md hover:bg-gray-100 flex items-center">
                <Network className="w-4 h-4 mr-1" />
                <span>网络设置</span>
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-sm text-gray-600">
              欢迎，{displayName}
            </span>
            <Link 
              href="/"
              className="flex items-center text-sm px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100 mr-2"
            >
              <Globe className="w-4 h-4 mr-1" />
              <span>前往首页</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center text-sm px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4 mr-1" />
              <span>退出</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 