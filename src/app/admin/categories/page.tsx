"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminHeader from "../AdminHeader";
import { Pencil, Plus, Trash2 } from "lucide-react";

// 分类接口
interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon?: string;
  count: number;
}

/**
 * 分类管理页面
 */
export default function CategoriesPage() {
  // 状态管理
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminName, setAdminName] = useState("管理员");

  // 客户端检查登录状态
  useEffect(() => {
    setIsClient(true);
    try {
      const storedAdminName = localStorage.getItem("adminName");
      const storedAdminId = localStorage.getItem("adminId");
      
      if (storedAdminId && storedAdminName) {
        setIsLoggedIn(true);
        setAdminName(storedAdminName);
      } else {
        // 未登录，重定向到登录页面
        window.location.href = "/admin/login";
      }
    } catch (error) {
      console.error("检查登录状态出错:", error);
      setIsLoggedIn(false);
    }
  }, []);

  // 加载分类数据
  useEffect(() => {
    if (isClient && isLoggedIn) {
      fetchCategories();
    }
  }, [isClient, isLoggedIn]);

  // 获取分类列表
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/categories");
      
      if (!response.ok) {
        throw new Error("获取分类失败");
      }
      
      const data = await response.json();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error("获取分类列表错误:", error);
      setError("获取分类列表失败，请重试");
      setLoading(false);
    }
  };

  // 删除分类函数（模拟）
  const handleDeleteCategory = (id: string) => {
    // 在实际应用中，这里会调用API删除分类
    const confirmDelete = confirm("确定要删除这个分类吗？");
    
    if (confirmDelete) {
      // 模拟删除操作
      setCategories(prevCategories => 
        prevCategories.filter(category => category.id !== id)
      );
      alert("分类删除成功！");
    }
  };

  // 如果在客户端且未登录，显示空内容
  if (!isClient || !isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader adminName={adminName} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">分类管理</h1>
            <Link
              href="/admin/categories/add"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Plus size={18} className="mr-1" />
              添加分类
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">加载中...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={fetchCategories}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                重试
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="py-3 px-4 text-left">ID</th>
                    <th className="py-3 px-4 text-left">图标</th>
                    <th className="py-3 px-4 text-left">中文名称</th>
                    <th className="py-3 px-4 text-left">英文名称</th>
                    <th className="py-3 px-4 text-left">游戏数量</th>
                    <th className="py-3 px-4 text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-4 px-4 text-center text-gray-500">
                        暂无分类数据
                      </td>
                    </tr>
                  ) : (
                    categories.map((category) => (
                      <tr key={category.id} className="border-t hover:bg-gray-50">
                        <td className="py-3 px-4">{category.id}</td>
                        <td className="py-3 px-4 text-xl">{category.icon || "🎮"}</td>
                        <td className="py-3 px-4">{category.name}</td>
                        <td className="py-3 px-4">{category.nameEn}</td>
                        <td className="py-3 px-4">{category.count}</td>
                        <td className="py-3 px-4 flex space-x-2">
                          <Link
                            href={`/admin/categories/edit/${category.id}`}
                            className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                            title="编辑"
                          >
                            <Pencil size={18} />
                          </Link>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                            title="删除"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 