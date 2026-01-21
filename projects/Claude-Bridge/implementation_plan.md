# Claude-Bridge 实现计划

## 目标描述
构建一个 Chrome 扩展，让 `claude.ai` 网页版能够读取用户当前浏览器标签页的内容，实现「给 Claude 装眼睛」的效果。

---

## 提议的更改

### 阶段 1: 项目初始化

#### [NEW] `package.json`
使用 Plasmo 框架初始化项目，配置 TypeScript 和 TailwindCSS。

#### [NEW] `tailwind.config.js`
配置 TailwindCSS 扫描路径。

---

### 阶段 2: 核心逻辑

#### [NEW] `contents/claude-bridge.tsx`
内容脚本，注入到 `claude.ai`:
- 在 Claude 输入框 (`.ProseMirror`) 附近注入「📥 Bridge」按钮
- 点击按钮时，向 Background Script 发送消息请求捕获当前标签页

#### [NEW] `background.ts`
后台脚本 (Service Worker):
- 监听来自内容脚本的消息
- 使用 `chrome.tabs` API 获取当前活跃标签页
- 使用 `chrome.scripting.executeScript` 提取页面正文
- 返回 `{ title, url, content }` 给内容脚本

#### [NEW] `contents/inject-text.ts`
辅助脚本:
- 将捕获的内容格式化后插入 Claude 输入框

---

### 阶段 3: UI 优化

#### [NEW] `popup.tsx`
弹出窗口 (可选):
- 显示扩展状态
- 提供「Buy me a Coffee」链接
- 提供捐赠地址 (SOL/USDT)

---

## 验证计划

### 自动化测试
1. `pnpm dev` - 启动开发服务器
2. 在 Chrome 中加载 `build/chrome-mv3-dev`
3. 打开 `claude.ai`，验证按钮是否出现

### 手动验证
1. 打开任意网页 (如 GitHub README)
2. 切换到 `claude.ai` 标签页
3. 点击「Bridge」按钮
4. 验证内容是否正确插入 Claude 输入框

---

## 权限需求 (Manifest V3)
```json
{
  "permissions": ["activeTab", "scripting"],
  "host_permissions": ["https://claude.ai/*"]
}
```

## 风险与注意事项
> [!WARNING]
> Claude.ai 的 DOM 结构可能随时变化，需要做好选择器失效的应对方案。

> [!IMPORTANT]
> 所有代码必须打包在扩展内，禁止远程加载 JavaScript。
