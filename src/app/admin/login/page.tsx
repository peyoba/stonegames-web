"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, Key, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Alert from "@/components/ui/alert";
import Link from "next/link";

/**
 * 管理员登录页面
 * 优化了UI和用户体验
 */
export default function AdminLogin() {
  // 状态管理
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // 确保只在客户端运行
  useEffect(() => {
    setIsClient(true);
    
    // 检查登录状态
    try {
      if (typeof window !== "undefined" && 
          window.localStorage.getItem("adminId") === "admin123") {
        router.push("/admin/dashboard");
      }
    } catch (e) {
      console.error("检查登录状态出错", e);
    }
  }, [router]);

  // 处理登录
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 这里应该有真正的登录API调用
      // 目前使用硬编码的凭据，实际项目中应替换为API调用
      if (username === "admin@stonegames.com" && password === "admin123") {
        // 保存登录状态
        window.localStorage.setItem("adminId", "admin123");
        window.localStorage.setItem("adminName", "管理员");
        
        // 延迟一点以显示加载状态
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 跳转到管理后台
        router.push("/admin/dashboard");
      } else {
        setError("用户名或密码错误");
      }
    } catch (e) {
      console.error("登录过程中出错", e);
      setError("登录失败，请稍后再试");
    } finally {
      setIsLoading(false);
    }
  }

  // 服务器端渲染时不显示内容
  if (!isClient) {
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="w-full max-w-md p-4">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <LockKeyhole className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">管理员登录</CardTitle>
            <CardDescription className="text-center">
              输入您的管理员凭据访问后台管理系统
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Alert type="error" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">登录失败</span>
              <span>{error}</span>
            </Alert>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="管理员邮箱"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    登录中...
                  </span>
                ) : (
                  <span className="flex items-center">
                    登录管理后台
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col">
            <div className="text-sm text-muted-foreground text-center mb-2">
              <p>默认管理员账号：admin@stonegames.com</p>
              <p>默认密码：admin123</p>
            </div>
            <div className="text-center mt-2">
              <Link 
                href="/"
                className="text-sm text-primary hover:underline"
              >
                返回首页
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 