# 🌉 Claude Bridge

<div align="center">

**让 Claude 网页版拥有「眼睛」— 读取其他标签页内容的 Chrome 扩展**

*Chrome Extension to read other tab content into Claude AI*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Plasmo](https://img.shields.io/badge/Built%20with-Plasmo-orange)](https://plasmo.com)
[![Chrome MV3](https://img.shields.io/badge/Manifest-V3-blue)](https://developer.chrome.com/docs/extensions/mv3/)

</div>

---

## ✨ 功能

- 📥 在 `claude.ai` 页面显示悬浮 Bridge 按钮
- 🔍 一键捕获其他标签页的 **标题、URL 和正文内容**
- 📋 自动复制到剪贴板，按 `Ctrl+V` 粘贴即可
- 🎯 智能选择：优先捕获 Claude 左边最近的标签页

## 📸 效果展示

| Bridge 按钮 | 捕获结果 |
|-------------|----------|
| 右下角悬浮按钮 | 内容自动复制，粘贴到输入框 |

## 🚀 安装

### 方式一：从源码构建（推荐）

```bash
# 1. 克隆仓库
git clone https://github.com/77AutumN/claude-bridge.git
cd claude-bridge/projects/Claude-Bridge/claude-bridge

# 2. 安装依赖
pnpm install

# 3. 构建生产版本
pnpm build
```

### 方式二：直接下载

1. 下载本仓库 ZIP 并解压
2. 进入 `projects/Claude-Bridge/claude-bridge/build/chrome-mv3-prod` 目录

### 加载到 Chrome

1. 打开 `chrome://extensions/`
2. 开启右上角 **「开发者模式」**
3. 点击 **「加载已解压的扩展程序」**
4. 选择 `build/chrome-mv3-prod` 目录

## 📖 使用方法

1. 打开想要分析的网页（如一篇文章、一条推文）
2. 切换到 `claude.ai` 标签页
3. 点击右下角的 **「📥 Bridge」** 按钮
4. 按 `Ctrl+V` 粘贴内容到输入框
5. 发送给 Claude！

## 🎯 最佳使用场景

| ✅ 适合 | ❌ 不适合 |
|---------|-----------|
| X/Twitter 帖子详情页 | 信息流首页 |
| 文章/博客内容页 | 纯图片页面 |
| GitHub README | 需要登录的页面 |
| 知乎回答/文章 | 视频页面 |

## 🛠 技术栈

- **Framework**: [Plasmo](https://plasmo.com) (React + TypeScript)
- **Styling**: TailwindCSS
- **Manifest**: Chrome Extension Manifest V3
- **Permissions**: `activeTab`, `scripting`, `tabs`

## 📁 项目结构

```
projects/Claude-Bridge/claude-bridge/
├── src/
│   ├── contents/
│   │   └── claude-bridge.tsx   # 内容脚本（Bridge 按钮）
│   ├── background.ts           # 后台脚本（内容捕获）
│   └── popup.tsx               # 弹出窗口
├── build/
│   ├── chrome-mv3-dev/         # 开发版本
│   └── chrome-mv3-prod/        # 生产版本
└── package.json
```

## 🤝 Contributing

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT License - 详见 [LICENSE](LICENSE) 文件

---

<div align="center">

Made with ❤️ by [77AutumN](https://github.com/77AutumN)

</div>
