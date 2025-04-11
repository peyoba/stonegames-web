#!/bin/bash

# 设置错误时退出
set -e

echo "🚀 开始部署 Stone Games 网站..."

# 安装依赖
echo "📦 安装依赖..."
pnpm install

# 构建项目
echo "🔨 构建项目..."
pnpm run build

# 检查构建是否成功
if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo "✅ 构建成功"

# 部署到 Cloudflare Pages
echo "☁️ 部署到 Cloudflare Pages..."
wrangler pages deploy .next/standalone --project-name stonegames-web

echo "🎉 部署完成！"
echo "🌐 网站地址: https://www.aistone.org" 