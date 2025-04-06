"use client";

import { useState, useEffect } from "react";
import AdminHeader from "../AdminHeader";
import { Save, Loader2, Check } from "lucide-react";

/**
 * 网络设置页面
 */
export default function NetworkSettingsPage() {
  // 状态管理
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [adminName, setAdminName] = useState("管理员");
  
  // 网络设置表单数据
  const [formData, setFormData] = useState({
    siteUrl: "",
    apiUrl: "",
    cdnUrl: "",
    allowCors: true,
    requestTimeout: 5000,
    maxUploadSize: 5,
    proxyEnabled: false,
    proxyUrl: ""
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

  // 加载网络设置数据
  useEffect(() => {
    if (isClient && isLoggedIn) {
      fetchNetworkSettings();
    }
  }, [isClient, isLoggedIn]);

  // 获取网络设置
  const fetchNetworkSettings = async () => {
    try {
      setLoading(true);
      
      // 调用API获取网络设置
      const response = await fetch('/api/network');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "获取网络设置失败");
      }
      
      const networkSettings = await response.json();
      setFormData(networkSettings);
      
      setLoading(false);
    } catch (error) {
      console.error("获取网络设置错误:", error);
      setError(error instanceof Error ? error.message : "获取网络设置失败，请重试");
      setLoading(false);
    }
  };

  // 处理表单字段变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // 根据字段类型设置不同的值
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value, 10) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!formData.siteUrl) {
      setError("网站URL不能为空");
      return;
    }
    
    setError("");
    setSuccess("");
    setSubmitting(true);
    
    try {
      // 调用API保存网络设置
      const response = await fetch('/api/network', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "保存网络设置失败");
      }
      
      const result = await response.json();
      
      setSuccess("网络设置已更新！");
      setSubmitting(false);
    } catch (error) {
      console.error("保存网络设置错误:", error);
      setError(error instanceof Error ? error.message : "保存网络设置失败，请重试");
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
          <h1 className="text-2xl font-bold text-gray-800 mb-6">网络设置</h1>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">加载中...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center text-green-700">
                  <Check size={20} className="mr-2" />
                  {success}
                </div>
              )}
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                  {error}
                </div>
              )}
              
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">基本URL设置</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="siteUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      网站URL
                    </label>
                    <input
                      type="text"
                      id="siteUrl"
                      name="siteUrl"
                      value={formData.siteUrl}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com"
                    />
                    <p className="mt-1 text-xs text-gray-500">您网站的主URL，例如 https://example.com</p>
                  </div>
                  
                  <div>
                    <label htmlFor="apiUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      API URL
                    </label>
                    <input
                      type="text"
                      id="apiUrl"
                      name="apiUrl"
                      value={formData.apiUrl}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://api.example.com"
                    />
                    <p className="mt-1 text-xs text-gray-500">API服务器的URL，如果与网站URL不同</p>
                  </div>
                  
                  <div>
                    <label htmlFor="cdnUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      CDN URL
                    </label>
                    <input
                      type="text"
                      id="cdnUrl"
                      name="cdnUrl"
                      value={formData.cdnUrl}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://cdn.example.com"
                    />
                    <p className="mt-1 text-xs text-gray-500">用于静态资源的CDN URL</p>
                  </div>
                </div>
                
                <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mt-8">请求设置</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allowCors"
                      name="allowCors"
                      checked={formData.allowCors}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="allowCors" className="ml-2 block text-sm text-gray-700">
                      允许跨域请求 (CORS)
                    </label>
                  </div>
                  
                  <div>
                    <label htmlFor="requestTimeout" className="block text-sm font-medium text-gray-700 mb-1">
                      请求超时 (毫秒)
                    </label>
                    <input
                      type="number"
                      id="requestTimeout"
                      name="requestTimeout"
                      value={formData.requestTimeout}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1000"
                      step="1000"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="maxUploadSize" className="block text-sm font-medium text-gray-700 mb-1">
                      最大上传大小 (MB)
                    </label>
                    <input
                      type="number"
                      id="maxUploadSize"
                      name="maxUploadSize"
                      value={formData.maxUploadSize}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="100"
                    />
                  </div>
                </div>
                
                <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mt-8">代理设置</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="proxyEnabled"
                      name="proxyEnabled"
                      checked={formData.proxyEnabled}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="proxyEnabled" className="ml-2 block text-sm text-gray-700">
                      启用代理
                    </label>
                  </div>
                  
                  {formData.proxyEnabled && (
                    <div>
                      <label htmlFor="proxyUrl" className="block text-sm font-medium text-gray-700 mb-1">
                        代理URL
                      </label>
                      <input
                        type="text"
                        id="proxyUrl"
                        name="proxyUrl"
                        value={formData.proxyUrl}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="http://proxy.example.com:8080"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-4 py-2 bg-blue-500 text-white rounded-md flex items-center ${
                    submitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-600"
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      保存设置
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
} 