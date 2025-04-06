"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

/**
 * 添加分类页面
 */
export default function AddCategoryPage() {
  // 状态管理
  const [isClient, setIsClient] = useState(false);
  const [adminName, setAdminName] = useState("管理员");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // 分类表单数据
  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    icon: ""
  });

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
  }, []);

  // 处理表单变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      // 注意：这里实际上会调用真实API，但现在我们只模拟成功
      // const response = await fetch("/api/categories", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData)
      // });
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟成功响应
      // if (response.ok) {
        setMessage({ 
          type: "success", 
          text: "分类添加成功！3秒后返回分类列表。" 
        });
        
        // 重置表单
        setFormData({
          name: "",
          nameEn: "",
          icon: ""
        });
        
        // 3秒后重定向
        setTimeout(() => {
          window.location.href = "/admin/categories";
        }, 3000);
      // } else {
      //   setMessage({ 
      //     type: "error", 
      //     text: "添加失败，请稍后重试。" 
      //   });
      // }
    } catch (error) {
      console.error("添加分类出错", error);
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

  // 可用的图标选项
  const iconOptions = ["🎮", "🧩", "🎯", "🎲", "🏝️", "🚀", "⚽", "🏆", "🎵", "🎨"];

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
        <h1 style={{ margin: 0 }}>添加分类</h1>
        <Link href="/admin/categories">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回分类列表
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

      {/* 添加分类表单 */}
      <div style={{ 
        background: "white", 
        borderRadius: "8px", 
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        padding: "20px"
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {/* 中文名称 */}
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                中文名称 <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="例如：益智游戏"
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #e2e8f0", 
                  borderRadius: "4px" 
                }}
              />
            </div>

            {/* 英文名称 */}
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                英文名称 <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleChange}
                required
                placeholder="例如：Puzzle"
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #e2e8f0", 
                  borderRadius: "4px" 
                }}
              />
            </div>

            {/* 分类图标 */}
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                分类图标
              </label>
              <div style={{ 
                display: "flex", 
                flexWrap: "wrap", 
                gap: "10px", 
                marginBottom: "15px" 
              }}>
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, icon }))}
                    style={{ 
                      width: "50px", 
                      height: "50px", 
                      fontSize: "24px", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      border: formData.icon === icon ? "2px solid #2563eb" : "1px solid #e2e8f0",
                      borderRadius: "4px",
                      background: formData.icon === icon ? "#eff6ff" : "white",
                      cursor: "pointer"
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="选择或输入图标"
                style={{ 
                  width: "100%", 
                  padding: "8px", 
                  border: "1px solid #e2e8f0", 
                  borderRadius: "4px" 
                }}
              />
              <p style={{ 
                fontSize: "12px", 
                color: "#6b7280", 
                marginTop: "5px" 
              }}>
                可以点击上方图标或手动输入emoji图标
              </p>
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
              {loading ? "处理中..." : "保存分类"}
              {!loading && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </form>
 