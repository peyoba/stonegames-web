# Stone Games 网站部署指南

## 部署环境

- 开发环境：Vercel
- 生产环境：Cloudflare Pages
- 域名：aistone.org

## 部署前准备

1. 确保已安装以下工具：
   - Node.js 18+
   - pnpm
   - Git
   - Cloudflare CLI (wrangler)

2. 配置环境变量：
   - 复制 `.env.example` 为 `.env.local`
   - 填写必要的环境变量

3. 确保数据库连接正常：
   ```bash
   pnpm run test-db
   ```

## 部署步骤

### 开发环境部署 (Vercel)

1. 安装 Vercel CLI：
   ```bash
   npm i -g vercel
   ```

2. 登录 Vercel：
   ```bash
   vercel login
   ```

3. 部署到 Vercel：
   ```bash
   pnpm run deploy:vercel
   ```

### 生产环境部署 (Cloudflare Pages)

1. 安装 Cloudflare CLI：
   ```bash
   npm i -g wrangler
   ```

2. 登录 Cloudflare：
   ```bash
   wrangler login
   ```

3. 部署到 Cloudflare Pages：
   ```bash
   pnpm run deploy:cloudflare
   ```

### 一键部署

使用部署脚本进行一键部署：
```bash
pnpm run deploy
```

## 域名配置

1. 在 Cloudflare 控制台添加域名：
   - 添加 aistone.org
   - 配置 DNS 记录
   - 启用 SSL/TLS

2. 配置重定向：
   - http://aistone.org -> https://www.aistone.org
   - https://aistone.org -> https://www.aistone.org

## 部署后检查

1. 检查网站是否正常访问
2. 检查数据库连接是否正常
3. 检查管理员登录是否正常
4. 检查游戏列表和详情页是否正常显示
5. 检查语言切换功能是否正常

## 常见问题

1. 部署失败：
   - 检查环境变量配置
   - 检查数据库连接
   - 检查构建日志

2. 网站访问异常：
   - 检查 DNS 配置
   - 检查 SSL 证书
   - 检查服务器日志

3. 数据库连接失败：
   - 检查数据库连接字符串
   - 检查网络连接
   - 检查数据库权限

## 维护建议

1. 定期备份数据库
2. 监控网站性能
3. 及时更新依赖
4. 定期检查日志
5. 保持代码更新

## 联系方式

如有问题，请联系：
- 邮箱：admin@stonegames.com
- GitHub：https://github.com/peyoba 