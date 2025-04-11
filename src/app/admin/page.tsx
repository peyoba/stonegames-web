"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * 管理员首页
 * 自动检查登录状态并重定向
 */
export default function AdminIndexPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  // 确保只在客户端运行
  useEffect(() => {
    setIsClient(true);
    
    // 检查登录状态
    try {
      if (typeof window !== "undefined") {
        const adminId = window.localStorage.getItem("adminId");
        
        if (adminId === "admin123") {
          // 已登录，重定向到仪表盘
          router.push("/admin/dashboard");
        } else {
          // 未登录，重定向到登录页面
          router.push("/admin/login");
        }
      }
    } catch (e) {
      console.error("检查登录状态出错", e);
      // 出错时重定向到登录页
      router.push("/admin/login");
    }
  }, [router]);
  
  // 显示加载动画
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">正在加载管理系统</h1>
        <p className="text-gray-600">请稍候，正在检查登录状态...</p>
      </div>
    </div>
  );
} 