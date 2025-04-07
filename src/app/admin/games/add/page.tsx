"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

/**
 * 添加游戏页面
 */
export default function AddGamePage() {
  // 状态管理
  const [isClient, setIsClient] = useState(false);
  const [adminName, setAdminName] = useState("管理员");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // 游戏表单数据
  const [formData, setFormData] = useState({
    title: "",
    titleEn: "",
    description: "",
    descriptionEn: "",
    longDescription: "",
    longDescriptionEn: "",
    imageUrl: "",
    gameUrl: "",
    categoryId: "1",
    developer: "",
    releaseDate: "",
    tags: ""
  });
  
  // 分类数据接口
  interface Category {
    _id: string;
    name: string;
    nameEn: string;
  }

  // 备用分类数据接口
  interface HomeData {
    categories: Category[];
  }

  // 分类列表
  const [categories, setCategories] = useState([
    { id: "1", name: "益智游戏", nameEn: "Puzzle" },
    { id: "2", name: "动作游戏", nameEn: "Action" }
  ]);

  // 确保只在客户端运行
  useEffect(() => {
    setIsClient(true);
    
    // 检查登录状态
    try {
      if (typeof window !== "undefined") {
        // 检查登录状态
        if (window.localStorage.getItem("admin_logged_in") !== "true") {
          window.location.href = "/admin/login";
          return;
        }
        
        // 获取管理员名称
        const name = window.localStorage.getItem("admin_name");
        if (name) {
          setAdminName(name);
        }
      }
    } catch (e) {
      console.error("检查登录状态出错", e);
      // 出错时重定向到登录页
      if (typeof window !== "undefined") {
        window.location.href = "/admin/login";
      }
    }
    
    // 获取分类数据
    fetch("/api/categories")
      .then(res => res.json())
      .then((data: Category[]) => {
        if (data && data.length > 0) {
          console.log("获取到的分类数据:", data);
          // 获取真实的MongoDB ObjectId
          const categoriesWithId = data.map(cat => ({
            id: cat._id, // 使用MongoDB的_id
            name: cat.name,
            nameEn: cat.nameEn
          }));
          setCategories(categoriesWithId);
          // 设置默认分类ID为第一个分类的ID
          if (categoriesWithId.length > 0) {
            setFormData(prev => ({
              ...prev,
              categoryId: categoriesWithId[0].id
            }));
          }
        }
      })
      .catch(err => {
        console.error("获取分类失败", err);
        // 如果API获取失败，使用备用分类数据
        fetch("/api/home")
          .then(res => res.json())
          .then((data: HomeData) => {
            if (data.categories && data.categories.length > 0) {
              const validCategories = data.categories
                .filter((cat: Category) => cat._id !== "all") // 排除"all"分类
                .map((cat: Category) => ({
                  id: cat._id,
                  name: cat.name,
                  nameEn: cat.nameEn
                }));
              
              if (validCategories.length > 0) {
                setCategories(validCategories);
                setFormData(prev => ({
                  ...prev,
                  categoryId: validCategories[0].id
                }));
              }
            }
          })
          .catch(err => console.error("备用分类获取失败", err));
      });
  }, []);

  // 处理表单变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    
    try {
      // 使用真实API调用
      const response = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean)
        })
      });
      
      if (response.ok) {
        setMessage({ 
          type: "success", 
          text: "游戏添加成功！3秒后返回游戏列表。" 
        });
        
        // 重置表单
        setFormData({
          title: "",
          titleEn: "",
          description: "",
          descriptionEn: "",
          longDescription: "",
          longDescriptionEn: "",
          imageUrl: "",
          gameUrl: "",
          categoryId: "1",
          developer: "",
          releaseDate: "",
          tags: ""
        });
        
        // 3秒后重定向
        setTimeout(() => {
          window.location.href = "/admin/games";
        }, 3000);
      } else {
        const errorData = await response.json();
        setMessage({ 
          type: "error", 
          text: errorData.error || "添加失败，请稍后重试。" 
        });
      }
    } catch (error) {
      console.error("添加游戏出错", error);
      setMessage({ 
        type: "error", 
        text: "添加失败，请稍后重试。" 
      });
    } finally {
      setLoading(false);
    }
  };

  // 服务器端渲染时不显示内容
  if (!isClient) {
    return null;
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      {/* 顶部导航 */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        padding: "10px 20px",
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        marginBottom: "20px"
      }}>
        <h2>石头游戏管理后台</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span>欢迎，{adminName}</span>
          <Button 
            onClick={() => {
              window.localStorage.removeItem("admin_logged_in");
              window.localStorage.removeItem("admin_name");
              window.location.href = "/admin/login";
            }}
            variant="destructive"
            size="sm"
          >
            退出登录
          </Button>
        </div>
      </div>

      {/* 页面标题与操作 */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <h1 style={{ margin: 0 }}>添加游戏</h1>
        <Link href="/admin/games">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回游戏列表
          </Button>
        </Link>
      </div>

      {/* 消息提示 */}
      {message.text && (
        <div style={{ 
          padding: "10px 15px", 
          borderRadius: "4px", 
          marginBottom: "20px",
          backgroundColor: message.type === "success" ? "#d1fae5" : "#fee2e2",
          color: message.type === "success" ? "#065f46" : "#b91c1c",
          border: `1px solid ${message.type === "success" ? "#a7f3d0" : "#fecaca"}`
        }}>
          {message.text}
        </div>
      )}

      {/* 添加游戏表单 */}
      <div style={{ 
        background: "white", 
        borderRadius: "8px", 
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        padding: "20px"
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* 中文标题 */}
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                中文标题 <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #e2e8f0", 
                  borderRadius: "4px" 
                }}
              />
            </div>

            {/* 英文标题 */}
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                英文标题 <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="titleEn"
                value={formData.titleEn}
                onChange={handleChange}
                required
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #e2e8f0", 
                  borderRadius: "4px" 
                }}
              />
            </div>

            {/* 中文简介 */}
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                中文简介 <span style={{ color: "red" }}>*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #e2e8f0", 
                  borderRadius: "4px",
                  height: "100px",
                  resize: "vertical"
                }}
              />
            </div>

            {/* 英文简介 */}
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                英文简介 <span style={{ color: "red" }}>*</span>
              </label>
              <textarea
                name="descriptionEn"
                value={formData.descriptionEn}
                onChange={handleChange}
                required
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #e2e8f0", 
                  borderRadius: "4px",
                  height: "100px", 
                  resize: "vertical"
                }}
              />
            </div>

            {/* 中文详细描述 */}
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                中文详细描述
              </label>
              <textarea
                name="longDescription"
                value={formData.longDescription}
                onChange={handleChange}
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #e2e8f0", 
                  borderRadius: "4px",
                  height: "150px",
                  resize: "vertical"
                }}
              />
            </div>

            {/* 英文详细描述 */}
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                英文详细描述
              </label>
              <textarea
                name="longDescriptionEn"
                value={formData.longDescriptionEn}
                onChange={handleChange}
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #e2e8f0", 
                  borderRadius: "4px",
                  height: "150px",
                  resize: "vertical"
                }}
              />
            </div>

            {/* 游戏分类 */}
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                游戏分类 <span style={{ color: "red" }}>*</span>
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #e2e8f0", 
                  borderRadius: "4px" 
                }}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.nameEn})
                  </option>
                ))}
              </select>
            </div>

            {/* 开发者 */}
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                开发者
              </label>
              <input
                type="text"
                name="developer"
                value={formData.developer}
                onChange={handleChange}
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #e2e8f0", 
                  borderRadius: "4px" 
                }}
              />
            </div>

            {/* 发布日期 */}
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                发布日期
              </label>
              <input
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #e2e8f0", 
                  borderRadius: "4px" 
                }}
              />
            </div>

            {/* 标签 */}
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                标签（用逗号分隔）
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="例如：益智,单人,数字,休闲"
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #e2e8f0", 
                  borderRadius: "4px" 
                }}
              />
            </div>

            {/* 封面图片链接 */}
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                封面图片链接 <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                required
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #e2e8f0", 
                  borderRadius: "4px" 
                }}
              />
            </div>

            {/* 游戏链接 */}
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                游戏链接 <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="url"
                name="gameUrl"
                value={formData.gameUrl}
                onChange={handleChange}
                required
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #e2e8f0", 
                  borderRadius: "4px" 
                }}
              />
            </div>
          </div>

          {/* 提交按钮 */}
          <div style={{ marginTop: "30px", textAlign: "center" }}>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto"
              size="lg"
            >
              {loading ? "处理中..." : "保存游戏"}
              {!loading && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 