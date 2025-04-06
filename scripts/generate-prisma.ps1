# 停止所有Node.js进程
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# 等待进程完全停止
Start-Sleep -Seconds 2

# 删除node_modules目录
if (Test-Path node_modules) {
    Remove-Item -Recurse -Force node_modules
}

# 重新安装依赖
pnpm install

# 生成Prisma客户端
npx prisma generate 