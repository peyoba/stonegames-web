"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import AdminHeader from "../AdminHeader";

// 游戏接口
interface Game {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  gameUrl: string;
  categoryId: string;
  views: number;
  likes: number;
}

// 分类接口
interface Category {
  id: string;
  name: string;
  nameEn: string;
}

/**
 * 游戏管理页面
 */
export default function GamesManagementPage() {
  // 状态管理
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminName, setAdminName] = useState("管理员");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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

  // 加载游戏和分类数据
  useEffect(() => {
    if (isClient && isLoggedIn) {
      fetchGames();
      fetchCategories();
    }
  }, [isClient, isLoggedIn]);

  // 获取游戏列表
  const fetchGames = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/games");
      
      if (!response.ok) {
        throw new Error("获取游戏失败");
      }
      
      const data = await response.json();
      setGames(data);
      setLoading(false);
    } catch (error) {
      console.error("获取游戏列表错误:", error);
      setError("获取游戏列表失败，请重试");
      setLoading(false);
    }
  };

  // 获取分类列表
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      
      if (!response.ok) {
        throw new Error("获取分类失败");
      }
      
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("获取分类列表错误:", error);
    }
  };

  // 删除游戏
  const handleDeleteGame = async (id: string) => {
    const confirmDelete = confirm("确定要删除这个游戏吗？");
    
    if (confirmDelete) {
      try {
        // 在实际环境中，这里会调用API删除游戏
        const response = await fetch(`/api/games/${id}`, {
          method: "DELETE"
        });
        
        if (!response.ok) {
          throw new Error("删除游戏失败");
        }
        
        // 更新游戏列表
        setGames(prevGames => prevGames.filter(game => game.id !== id));
        
        alert("游戏删除成功！");
      } catch (error) {
        console.error("删除游戏错误:", error);
        alert("删除游戏失败，请重试");
      }
    }
  };

  // 过滤游戏列表
  const filteredGames = games.filter(game => {
    // 按分类过滤
    const categoryMatch = selectedCategory ? game.categoryId === selectedCategory : true;
    
    // 按搜索词过滤
    const searchLower = searchQuery.toLowerCase();
    const searchMatch = searchQuery ? 
      game.title.toLowerCase().includes(searchLower) || 
      game.description.toLowerCase().includes(searchLower) : 
      true;
    
    return categoryMatch && searchMatch;
  });

  // 获取分类名称
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "未分类";
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
            <h1 className="text-2xl font-bold text-gray-800">游戏管理</h1>
            <Link
              href="/admin/games/add"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Plus size={18} className="mr-1" />
              添加游戏
            </Link>
          </div>
          
          {/* 搜索和筛选 */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="md:w-1/2">
              <input
                type="text"
                placeholder="搜索游戏..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:w-1/2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">所有分类</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 游戏列表 */}
          {loading ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">加载中...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={fetchGames}
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
                    <th className="py-3 px-4 text-left">封面</th>
                    <th className="py-3 px-4 text-left">标题</th>
                    <th className="py-3 px-4 text-left">分类</th>
                    <th className="py-3 px-4 text-left">浏览量</th>
                    <th className="py-3 px-4 text-left">点赞数</th>
                    <th className="py-3 px-4 text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGames.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                        暂无游戏数据
                      </td>
                    </tr>
                  ) : (
                    filteredGames.map((game) => (
                      <tr key={game.id} className="border-t hover:bg-gray-50">
                        <td className="py-3 px-4">{game.id}</td>
                        <td className="py-3 px-4">
                          <img 
                            src={game.imageUrl} 
                            alt={game.title} 
                            className="w-16 h-16 object-cover rounded"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium">{game.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {game.description.length > 50 
                              ? `${game.description.substring(0, 50)}...` 
                              : game.description}
                          </div>
                        </td>
                        <td className="py-3 px-4">{getCategoryName(game.categoryId)}</td>
                        <td className="py-3 px-4">{game.views}</td>
                        <td className="py-3 px-4">{game.likes}</td>
                        <td className="py-3 px-4 flex space-x-2">
                          <Link
                            href={`/games/${game.id}`}
                            className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                            title="查看"
                            target="_blank"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            href={`/admin/games/edit/${game.id}`}
                            className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                            title="编辑"
                          >
                            <Pencil size={18} />
                          </Link>
                          <button
                            onClick={() => handleDeleteGame(game.id)}
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