# 石头游戏网站 - Stone Games

一个简洁的HTML5游戏集合网站，提供各种经典小游戏和益智游戏。

## 功能特点

- 游戏分类浏览
- 游戏详情展示
- 响应式设计
- 管理后台
- MongoDB数据存储

## 技术栈

- Next.js 14.1.0
- React 18
- TypeScript
- Tailwind CSS
- MongoDB

## 开始使用

### 环境要求

- Node.js 18.0.0 或更高版本
- pnpm 8.0.0 或更高版本
- MongoDB

### 安装步骤

1. 克隆仓库

```bash
git clone https://github.com/yourusername/stonegames-web.git
cd stonegames-web
```

2. 安装依赖

```bash
pnpm install
```

3. 配置环境变量

创建 `.env.local` 文件，并添加以下内容：

```
# MongoDB 连接信息
MONGODB_URI=你的MongoDB连接字符串
MONGODB_DB=stonegames

# 应用信息
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. 初始化数据库

```bash
pnpm seed
```

5. 启动开发服务器

```bash
pnpm dev
```

6. 访问网站

打开浏览器，访问 [http://localhost:3000](http://localhost:3000)

## MongoDB 数据库设置

1. 创建 MongoDB Atlas 账户或使用本地 MongoDB 服务器
2. 创建名为 `stonegames` 的数据库
3. 在连接字符串中使用该数据库名称
4. 运行 `pnpm seed` 脚本初始化数据

## 部署

项目可以部署到 Vercel、Netlify 或其他支持 Next.js 的平台。

```bash
pnpm build
pnpm start
```

## 管理后台

访问 `/admin/login` 路径登录管理后台，默认账号密码：

- 用户名：admin@stonegames.com
- 密码：admin123

## 许可证

MIT 