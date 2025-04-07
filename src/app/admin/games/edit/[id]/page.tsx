"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import AdminHeader from "../../../AdminHeader";
import { Check, ChevronLeft, Loader2, Plus, X } from "lucide-react";

// 接口定义
interface GameDetails {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  screenshots: string[];
  gameUrl: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    nameEn: string;
    icon?: string;
  };
  releaseDate: string;
  developer: string;
  tags: string[];
  likes: number;
  views: number;
}

interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon?: string;
  count: number;
}

// API 分类数据接口
interface ApiCategory {
  _id: string;
  name: string;
  nameEn: string;
  icon?: string;
  count?: number;
}

// API 游戏数据接口
interface ApiGameDetails {
  _id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  longDescription: string;
  longDescriptionEn: string;
  imageUrl: string;
  screenshots: string[];
  gameUrl: string;
  categoryId: string | { _id: string };
  developer: string;
  releaseDate: string;
  tags: string[];
  likes: number;
  views: number;
}

// 表单数据接口
interface FormData {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  longDescription: string;
  longDescriptionEn: string;
  imageUrl: string;
  screenshots: string[];
  gameUrl: string;
  categoryId: string;
  developer: string;
  releaseDate: string;
  tags: string[];
}

export default function EditGamePage() {
  // 获取路由参数和路由操作对象
  const params = useParams();
  const router = useRouter();
  const gameId = params.id as string;

  // 状态管理
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [adminName, setAdminName] = useState("管理员");
  const [categories, setCategories] = useState<Category[]>([]);
  
  // 添加图片错误状态跟踪
  const [coverImageError, setCoverImageError] = useState(false);
  const [screenshotErrors, setScreenshotErrors] = useState<Record<number, boolean>>({});
  
  // 表单数据
  const [formData, setFormData] = useState<FormData>({
    title: "",
    titleEn: "",
    description: "",
    descriptionEn: "",
    longDescription: "",
    longDescriptionEn: "",
    imageUrl: "",
    screenshots: [],
    gameUrl: "",
    categoryId: "",
    developer: "",
    releaseDate: "",
    tags: []
  });
  
  // 标签输入
  const [tagInput, setTagInput] = useState("");

  // 客户端检查登录状态和ID有效性
  useEffect(() => {
    setIsClient(true);
    
    // 检查游戏ID是否有效
    if (!gameId || gameId === 'undefined' || gameId === 'null') {
      console.error('无效的游戏ID:', gameId);
      setError('无效的游戏ID');
      // 延迟重定向回游戏列表页
      setTimeout(() => {
        window.location.href = '/admin/games';
      }, 2000);
      return;
    }
    
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
  }, [gameId]);

  // 加载分类和游戏数据
  useEffect(() => {
    if (isClient && isLoggedIn) {
      fetchCategories();
      fetchGameDetails();
    }
  }, [isClient, isLoggedIn, gameId]);

  // 获取分类列表
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      
      if (!response.ok) {
        throw new Error("获取分类失败");
      }
      
      const data: ApiCategory[] = await response.json();
      
      // 正确处理分类数据，确保ID格式正确
      const formattedCategories = data.map((category: ApiCategory) => ({
        id: category._id.toString(), // 确保ID是字符串格式
        name: category.name,
        nameEn: category.nameEn,
        icon: category.icon,
        count: category.count || 0
      }));
      
      console.log("获取到的分类数据:", formattedCategories);
      setCategories(formattedCategories);
    } catch (error) {
      console.error("获取分类列表错误:", error);
    }
  };

  // 获取游戏详情
  const fetchGameDetails = async () => {
    try {
      setLoading(true);
      
      // 验证gameId是否有效
      if (!gameId || gameId === 'undefined' || gameId === 'null') {
        setError("无效的游戏ID");
        setLoading(false);
        setTimeout(() => {
          router.push("/admin/games");
        }, 2000);
        return;
      }
      
      console.log("获取游戏详情，ID:", gameId);
      const response = await fetch(`/api/games/${gameId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "获取游戏详情失败");
      }
      
      const game: ApiGameDetails = await response.json();
      console.log("获取到的游戏数据:", game);
      
      // 确保categoryId是原始的MongoDB ObjectId字符串格式
      // 这对于后续更新操作很重要
      const categoryId = game.categoryId && typeof game.categoryId === 'object' && game.categoryId._id 
        ? game.categoryId._id.toString() 
        : (typeof game.categoryId === 'string' ? game.categoryId : "");
      
      setFormData({
        title: game.title || "",
        titleEn: game.titleEn || "",
        description: game.description || "",
        descriptionEn: game.descriptionEn || "",
        longDescription: game.longDescription || "",
        longDescriptionEn: game.longDescriptionEn || "",
        imageUrl: game.imageUrl || "",
        screenshots: game.screenshots || [],
        gameUrl: game.gameUrl || "",
        categoryId: categoryId, // 使用处理后的categoryId
        developer: game.developer || "",
        releaseDate: game.releaseDate || "",
        tags: game.tags || []
      });
      
      setLoading(false);
    } catch (error) {
      console.error("获取游戏详情错误:", error);
      setError("获取游戏详情失败，请重试");
      setLoading(false);
      // 获取失败后，几秒后返回游戏列表
      setTimeout(() => {
        router.push("/admin/games");
      }, 2000);
    }
  };

  // 处理表单字段变化
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 添加标签
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  // 移除标签
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  // 添加截图链接
  const handleAddScreenshot = () => {
    // 创建一个输入框让用户输入截图链接
    const screenshotUrl = prompt("请输入截图链接");
    if (screenshotUrl && screenshotUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        screenshots: [...(prev.screenshots || []), screenshotUrl.trim()]
      }));
    }
  };

  // 移除截图链接
  const handleRemoveScreenshot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      screenshots: prev.screenshots?.filter((_, i) => i !== index) || []
    }));
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!formData.title || !formData.titleEn || !formData.description || !formData.descriptionEn || 
        !formData.imageUrl || !formData.gameUrl || !formData.categoryId) {
      setError("请填写完整的游戏信息（标题、简介、图片、游戏链接和分类必填）");
      return;
    }
    
    // 验证游戏ID是否有效
    if (!gameId || gameId === 'undefined' || gameId === 'null') {
      setError("无效的游戏ID，无法更新");
      return;
    }
    
    setError("");
    setSuccess("");
    setSubmitting(true);
    
    try {
      console.log("提交的游戏数据:", formData);
      
      // 检查分类ID格式是否为24位十六进制字符串
      const categoryIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!categoryIdRegex.test(formData.categoryId)) {
        setError("分类ID格式不正确，请重新选择分类");
        setSubmitting(false);
        return;
      }
      
      // 调用API更新游戏
      const response = await fetch(`/api/games/${gameId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "更新游戏失败");
      }
      
      const result = await response.json();
      console.log("更新结果:", result);
      
      // 更新成功
      setSuccess("游戏更新成功！");
      setSubmitting(false);
      
      // 延迟返回游戏列表页
      setTimeout(() => {
        router.push("/admin/games");
      }, 1500);
    } catch (error: any) {
      console.error("更新游戏错误:", error);
      setError(error.message || "更新游戏失败，请重试");
      setSubmitting(false);
    }
  };

  // 如果在客户端且未登录，显示空内容
  if (!isClient || !isLoggedIn) {
    return null;
  }

  // 如果有错误信息，显示错误页面
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 text-center mb-4 text-xl">⚠️ {error}</div>
          <p className="text-gray-600 text-center mb-6">
            无法加载游戏编辑页面，可能是游戏ID无效或已被删除。
          </p>
          <div className="flex justify-center">
            <Link
              href="/admin/games"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              返回游戏列表
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader adminName={adminName} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <Link 
              href="/admin/games" 
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">编辑游戏</h1>
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
                onClick={fetchGameDetails}
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
              
              <div className="space-y-6">
                {/* 基本信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      游戏标题
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="例如：2048"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                      游戏分类
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">选择分类</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name} ({category.nameEn})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* 描述 */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    游戏描述
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请详细描述游戏的玩法、特点等信息..."
                    required
                  />
                </div>
                
                {/* 链接信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      游戏封面图片链接
                    </label>
                    <input
                      type="text"
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="例如：/images/games/2048.png"
                      required
                    />
                    
                    {formData.imageUrl && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-1">图片预览：</p>
                        <img 
                          src={coverImageError ? "/images/placeholder.jpg" : formData.imageUrl} 
                          alt="封面预览"
                          className="w-32 h-32 object-cover rounded border border-gray-200"
                          onError={(e) => {
                            if (!coverImageError) {
                              setCoverImageError(true);
                              e.currentTarget.src = "/images/placeholder.jpg";
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="gameUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      游戏链接
                    </label>
                    <input
                      type="text"
                      id="gameUrl"
                      name="gameUrl"
                      value={formData.gameUrl}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="例如：/games/2048"
                      required
                    />
                  </div>
                </div>
                
                {/* 开发者 */}
                <div>
                  <label htmlFor="developer" className="block text-sm font-medium text-gray-700 mb-1">
                    开发者
                  </label>
                  <input
                    type="text"
                    id="developer"
                    name="developer"
                    value={formData.developer}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例如：Gabriele Cirulli"
                  />
                </div>
                
                {/* 标签 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    游戏标签
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="输入标签后按回车或点击添加按钮"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-3 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                    >
                      添加
                    </button>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.tags?.map((tag, index) => (
                      <div 
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 截图 */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      游戏截图
                    </label>
                    <button
                      type="button"
                      onClick={handleAddScreenshot}
                      className="text-sm flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <Plus size={16} className="mr-1" />
                      添加截图
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                    {formData.screenshots?.map((screenshot, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={screenshotErrors[index] ? "/images/placeholder.jpg" : screenshot} 
                          alt={`截图 ${index + 1}`}
                          className="w-full h-32 object-cover rounded border border-gray-200"
                          onError={(e) => {
                            if (!screenshotErrors[index]) {
                              setScreenshotErrors(prev => ({
                                ...prev,
                                [index]: true
                              }));
                              e.currentTarget.src = "/images/placeholder.jpg";
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveScreenshot(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="删除截图"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    
                    {formData.screenshots?.length === 0 && (
                      <div className="border border-dashed border-gray-300 rounded-md p-4 text-center text-gray-500">
                        暂无截图，点击"添加截图"添加
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 按钮 */}
                <div className="flex space-x-4 pt-4">
                  <Link
                    href="/admin/games"
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
                    {submitting ? "保存中..." : "保存游戏"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
} 