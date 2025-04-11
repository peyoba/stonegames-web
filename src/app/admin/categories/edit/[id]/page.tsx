"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AdminHeader from "../../../AdminHeader";
import { Check, ChevronLeft, Loader2 } from "lucide-react";

// 分类接口
type Category = {
  id: string;
  name: string;
  nameEn: string;
  icon?: string;
  count: number;
}

// 可用的图标选项
const availableIcons = [
  "🎮", "🎯", "🎲", "🧩", "🏆", "⚽", "🏀", "🏝️", 
  "🚗", "✈️", "🚀", "🎨", "🎭", "🎵", "📚", "💡"
];

export default function EditCategoryPage() {
  // 获取路由参数和路由操作对象
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  // 状态管理
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [adminName, setAdminName] = useState("管理员");
  
  // 表单数据
  const [formData, setFormData] = useState<Omit<Category, 'id' | 'count'>>({
    name: "",
    nameEn: "",
    icon: "🎮",
  });

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
      // 检查分类ID是否有效
      if (!categoryId || categoryId === 'undefined') {
        setError("无效的分类ID，请返回分类列表重新选择");
        setLoading(false);
        return;
      }
      
      // 使用24位十六进制字符串验证ID格式
      const idRegex = /^[0-9a-fA-F]{24}$/;
      if (!idRegex.test(categoryId)) {
        setError("分类ID格式不正确，请返回分类列表重新选择");
        setLoading(false);
        return;
      }
      
      fetchCategoryDetails();
    }
  }, [isClient, isLoggedIn, categoryId]);

  // 获取分类详情
  const fetchCategoryDetails = async () => {
    try {
      setLoading(true);
      
      if (!categoryId) {
        throw new Error("分类ID不存在");
      }
      
      // 直接获取特定分类详情，而不是获取所有分类再筛选
      const response = await fetch(`/api/categories/${categoryId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "获取分类详情失败");
      }
      
      const category = await response.json();
      
      // 确保id字段存在
      setFormData({
        name: category.name,
        nameEn: category.nameEn,
        icon: category.icon || "🎮",
      });
      
      setLoading(false);
    } catch (error) {
      console.error("获取分类详情错误:", error);
      setError(error instanceof Error ? error.message : "获取分类详情失败，请重试");
      setLoading(false);
    }
  };

  // 处理表单字段变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 选择图标
  const handleSelectIcon = (icon: string) => {
    setFormData(prev => ({
      ...prev,
      icon
    }));
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!formData.name || !formData.nameEn) {
      setError("请填写完整的分类信息");
      return;
    }
    
    setError("");
    setSuccess("");
    setSubmitting(true);
    
    try {
      // 调用API更新分类
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "更新分类失败");
      }
      
      setSuccess("分类更新成功！");
      setSubmitting(false);
      
      // 更新成功后延迟返回分类列表页
      setTimeout(() => {
        router.push("/admin/categories");
      }, 1500);
    } catch (error) {
      console.error("更新分类错误:", error);
      setError(error instanceof Error ? error.message : "更新分类失败，请重试");
      setSubmitting(false);
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
          <div className="flex items-center mb-6">
            <Link 
              href="/admin/categories" 
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">编辑分类</h1>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">加载中...</p>
            </div>
          ) : error && !success ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={fetchCategoryDetails}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                重试
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center text-green-700">
                  <Check size={20} className="mr-2" />
                  {success}
                </div>
              )}
              
              {error && !success && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    分类名称（中文）
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例如：益智游戏"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="nameEn" className="block text-sm font-medium text-gray-700 mb-1">
                    分类名称（英文）
                  </label>
                  <input
                    type="text"
                    id="nameEn"
                    name="nameEn"
                    value={formData.nameEn}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例如：Puzzle Games"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择分类图标
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {availableIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => handleSelectIcon(icon)}
                      className={`text-2xl h-12 w-12 flex items-center justify-center rounded-md ${
                        formData.icon === icon
                          ? "bg-blue-100 border-2 border-blue-500"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="selected-icon mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  当前选择的图标
                </label>
                <div className="bg-gray-50 p-4 rounded-md inline-block">
                  <span className="text-4xl">{formData.icon}</span>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Link
                  href="/admin/categories"
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
                >
                  取消
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-4 py-2 bg-blue-500 text-white rounded-md flex items-center ${
                    submitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-600"
                  }`}
                >
                  {submitting && <Loader2 size={18} className="mr-2 animate-spin" />}
                  {submitting ? "保存中..." : "保存分类"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
} 