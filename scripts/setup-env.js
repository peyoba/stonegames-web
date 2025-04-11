/**
 * 环境变量设置脚本
 * 在构建前自动检查环境变量并设置默认值
 */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

console.log('正在检查环境变量...');

// 必需的环境变量列表
const requiredEnvVars = [
  'MONGODB_URI',
  'MONGODB_DB',
  'NEXTAUTH_SECRET',
];

// 检查必需的环境变量
let missingVars = [];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    missingVars.push(envVar);
  }
}

// 如果有缺失的环境变量，报错
if (missingVars.length > 0) {
  console.error(`缺少以下必需的环境变量: ${missingVars.join(', ')}`);
  console.error('请在 .env 文件中设置这些变量，或者在部署环境中配置它们。');
  
  // 在开发环境中，提供更详细的提示
  if (process.env.NODE_ENV !== 'production') {
    console.log('\n请参考 .env.example 文件设置环境变量。');
  }
  
  // 在生产环境中不阻止构建，但会记录警告
  if (process.env.NODE_ENV === 'production') {
    console.warn('警告: 在生产环境中缺少必需的环境变量，应用可能无法正常运行。');
  } else {
    process.exit(1); // 开发环境中终止构建
  }
}

// 设置默认值
if (!process.env.NEXT_PUBLIC_SITE_URL) {
  process.env.NEXT_PUBLIC_SITE_URL = 'https://aistone.org';
  console.log('已设置默认 NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);
}

if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = process.env.NEXT_PUBLIC_SITE_URL;
  console.log('已设置默认 NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
}

console.log('环境变量检查完成。');

// 在Cloudflare Pages构建环境中，创建临时的.env.production文件
if (process.env.CF_PAGES === '1') {
  console.log('检测到Cloudflare Pages环境，正在创建.env.production文件...');
  
  const envContent = Object.entries(process.env)
    .filter(([key]) => {
      // 只包含特定前缀的环境变量
      return key.startsWith('NEXT_') || 
             key.startsWith('MONGODB_') || 
             key.startsWith('NEXTAUTH_') ||
             key.startsWith('ADMIN_');
    })
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  fs.writeFileSync(path.join(process.cwd(), '.env.production'), envContent);
  console.log('.env.production文件已创建。');
}

console.log('环境设置完成，准备开始构建...'); 