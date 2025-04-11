# Stone Games 部署指南

本文档将指导你如何将 Stone Games 网站部署到 Cloudflare Pages。

## 准备工作

1. **GitHub 账号**：确保你有 GitHub 账号并已将代码推送到仓库。
2. **Cloudflare 账号**：注册 [Cloudflare](https://dash.cloudflare.com/sign-up) 账号。
3. **域名**：准备好你要使用的域名（例如 aistone.org）。

## 环境变量配置

在部署前，需要设置以下环境变量：

| 变量名 | 描述 | 示例 |
|--------|------|------|
| `MONGODB_URI` | MongoDB 连接字符串 | `mongodb+srv://username:password@cluster.mongodb.net/stonegames` |
| `MONGODB_DB` | MongoDB 数据库名称 | `stonegames` |
| `NEXT_PUBLIC_SITE_URL` | 网站 URL | `https://aistone.org` |
| `NEXTAUTH_URL` | NextAuth URL，通常与网站 URL 相同 | `https://aistone.org` |
| `NEXTAUTH_SECRET` | NextAuth 密钥，用于加密会话 | 随机生成的字符串 |
| `ADMIN_USERNAME` | 管理员用户名 | `admin` |
| `ADMIN_PASSWORD` | 管理员密码 | 强密码 |

## 部署到 Cloudflare Pages

### 步骤 1: 连接 GitHub 仓库

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 "Pages" 菜单
3. 点击 "创建项目"
4. 选择 "连接到 Git"
5. 选择你的 GitHub 账号
6. 授权 Cloudflare 访问你的仓库
7. 选择包含 Stone Games 代码的仓库

### 步骤 2: 配置构建设置

配置以下构建设置：

- **项目名称**：`stone-games`（或你喜欢的名称）
- **生产分支**：`main`
- **构建命令**：`npm run build`
- **构建输出目录**：`.next`
- **构建系统版本**：2（使用最新版本）
- **Node.js 版本**：18（或更高）

### 步骤 3: 环境变量设置

1. 在构建配置页面，展开 "环境变量" 部分
2. 添加上面列出的所有环境变量
3. 请确保设置了 `NODE_VERSION=18`

### 步骤 4: 部署

1. 点击 "保存并部署"
2. 等待构建和部署完成（通常需要几分钟）
3. 部署完成后，你会得到一个 `*.pages.dev` 域名的 URL

## 配置自定义域名

### 步骤 1: 添加自定义域名

1. 在项目页面，点击 "自定义域"
2. 点击 "设置自定义域"
3. 输入你的域名（例如 `aistone.org`）
4. 选择 "根域名"
5. 点击 "继续"

### 步骤 2: 配置 DNS

如果你的域名注册商是 Cloudflare，DNS 设置会自动完成。如果不是，请按照 Cloudflare 提供的说明，设置你的 DNS 记录。

通常，你需要添加以下 DNS 记录：

- 类型：`CNAME`
- 名称：`@` 或 `www`（取决于你的设置）
- 目标：Cloudflare 提供的 `*.pages.dev` 域名
- TTL：`Auto`

### 步骤 3: 等待 DNS 传播

DNS 更改可能需要一些时间才能完全传播（通常几分钟到几小时）。之后，你的网站将通过你的自定义域名访问。

## SSL 配置

Cloudflare Pages 默认已启用 SSL。默认设置为：

- SSL 模式：完全
- Always Use HTTPS：是
- HTTP/3 (QUIC)：是
- 0-RTT 连接恢复：是

## CDN 和缓存设置

Cloudflare 已经为你的网站提供了 CDN 服务。可以在 "Rules" > "Cache Rules" 中自定义缓存规则。

我们的 `_headers` 文件已经配置了基本的缓存控制，但你可能想要根据具体情况进行调整。

## 监控与分析

部署完成后，你可以使用以下工具监控你的网站：

1. **Cloudflare Analytics**：在 Cloudflare Dashboard 中直接可用
2. **Google Analytics**：设置 GA4 以跟踪用户行为
3. **Sentry**：用于监控错误和性能问题

## 部署后检查清单

- [ ] 确认网站能够在自定义域名上访问
- [ ] 测试管理员登录功能
- [ ] 验证游戏列表和详情页是否正常显示
- [ ] 检查移动端和桌面端的响应式设计
- [ ] 测试搜索和分类功能
- [ ] 确保多语言切换功能正常
- [ ] 检查 SSL 是否正常工作（网址是否显示为 HTTPS）
- [ ] 测试浏览量和点赞功能

## 故障排除

如果遇到问题，可以检查以下内容：

1. Cloudflare Pages 的构建日志
2. 环境变量是否正确配置
3. MongoDB 连接是否正常
4. DNS 设置是否正确

如需更多帮助，请参考 [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)。 