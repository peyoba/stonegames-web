"use client";

import React, { useState, useEffect } from "react";

/**
 * 超简单登录页面
 * 完全避免复杂组件和依赖
 */
export default function AdminLogin() {
  // 状态管理
  const [username, setUsername] = useState("admin@stonegames.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);

  // 确保只在客户端运行
  useEffect(() => {
    setIsClient(true);
    
    // 检查登录状态
    try {
      if (typeof window !== "undefined" && 
          window.localStorage.getItem("adminId") === "admin123") {
        window.location.href = "/admin/dashboard";
      }
    } catch (e) {
      console.error("检查登录状态出错", e);
    }
  }, []);

  // 处理登录
  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // 简单验证
    if (username === "admin@stonegames.com" && password === "admin123") {
      try {
        // 保存登录状态
        window.localStorage.setItem("adminId", "admin123");
        window.localStorage.setItem("adminName", "管理员");
        
        // 跳转到管理后台
        window.location.href = "/admin/dashboard";
      } catch (e) {
        console.error("保存登录状态出错", e);
        setError("登录失败: 无法保存登录状态");
      }
    } else {
      setError("用户名或密码错误");
    }
  }

  // 服务器端渲染时不显示内容
  if (!isClient) {
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">管理员登录</h1>
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              邮箱:
            </label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              密码:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              登录
            </button>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>默认账号：admin@stonegames.com</p>
            <p>默认密码：admin123</p>
          </div>
        </form>
      </div>
    </div>
  );
} 