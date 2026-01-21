---
name: Plasmo 项目初始化
description: 自动初始化 Plasmo Chrome 扩展项目，配置 TypeScript, TailwindCSS 和 manifest.json
---
# Plasmo 项目初始化 Skill

## 触发条件
- 用户说 "初始化 Plasmo 项目"
- 用户运行 `/plasmo-init`
- 用户提到需要创建新的 Chrome 扩展项目

## 执行步骤

### 1. 环境检查
```powershell
# 检查 Node.js 和 pnpm
node --version
pnpm --version
```
如果 pnpm 不存在，运行: `npm install -g pnpm`

### 2. 初始化 Plasmo 项目
```powershell
# 在目标目录运行
pnpm create plasmo --with-tailwindcss
```

**交互式选项推荐:**
- Project name: 使用计划书中的项目名
- Language: **TypeScript**
- Styling: **Tailwind CSS**

### 3. 基础配置

#### 3.1 更新 `package.json`
确保包含以下脚本:
```json
{
  "scripts": {
    "dev": "plasmo dev",
    "build": "plasmo build",
    "package": "plasmo package"
  }
}
```

#### 3.2 配置 TailwindCSS (`tailwind.config.js`)
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{tsx,ts,jsx,js}",
    "./popup.tsx",
    "./options.tsx",
    "./contents/**/*.tsx"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 4. 目录结构说明
```
项目根目录/
├── src/
│   ├── popup.tsx          # 弹出窗口 UI
│   ├── options.tsx        # 选项页面 (可选)
│   ├── background.ts      # Service Worker (后台脚本)
│   └── contents/          # 内容脚本 (注入目标网页)
│       └── index.tsx
├── assets/                # 图标和静态资源
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

### 5. 验证
```powershell
pnpm dev
```
- 打开 Chrome 扩展管理页 (`chrome://extensions`)
- 开启「开发者模式」
- 点击「加载已解压的扩展程序」
- 选择 `build/chrome-mv3-dev` 目录

## 注意事项
- Plasmo 使用 **Manifest V3**，是 Chrome 当前推荐的标准。
- 所有逻辑必须打包在扩展内，**禁止远程加载代码**。
