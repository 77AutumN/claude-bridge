---
name: 内容脚本注入
description: 将 UI 元素注入第三方网页的模式和代码模板
---
# 内容脚本注入 Skill

## 触发条件
- 用户需要向第三方网页注入按钮、浮窗或其他 UI
- 用户提到 "内容脚本" 或 "content script"
- 项目需要修改目标网页的 DOM

## 核心概念

### 什么是内容脚本?
内容脚本是运行在**目标网页上下文**中的 JavaScript/TypeScript 代码，可以:
- 读取和修改网页 DOM
- 与后台脚本 (Background Script) 通信
- 无法直接访问网页的 JavaScript 变量 (隔离环境)

---

## Plasmo 内容脚本模板

### 1. 基础结构 (`contents/index.tsx`)
```tsx
import type { PlasmoCSConfig } from "plasmo"

// 配置: 指定注入的目标网页
export const config: PlasmoCSConfig = {
  matches: ["https://claude.ai/*"],  // 只在 claude.ai 生效
  run_at: "document_idle"            // 页面加载完成后注入
}

// 主入口
const ContentScript = () => {
  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: 9999
    }}>
      <button onClick={handleClick}>
        🔗 Bridge
      </button>
    </div>
  )
}

const handleClick = async () => {
  // 与 Background Script 通信
  const response = await chrome.runtime.sendMessage({ action: "capture_tab" })
  console.log("Captured:", response)
}

export default ContentScript
```

### 2. 注入到特定 DOM 位置 (Plasmo CSUI)
```tsx
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://claude.ai/*"]
}

// 指定锚点: 注入到 Claude 的输入框旁边
export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
  return document.querySelector(".ProseMirror")?.parentElement
}

// 组件会自动渲染在锚点附近
const InlineButton = () => {
  return (
    <button className="bridge-button">
      📥 读取当前页面
    </button>
  )
}

export default InlineButton
```

---

## 与后台脚本通信

### 内容脚本发送消息
```tsx
// contents/index.tsx
const handleCapture = async () => {
  const response = await chrome.runtime.sendMessage({
    action: "GET_PAGE_CONTENT"
  })
  console.log(response.content)
}
```

### 后台脚本接收消息
```ts
// background.ts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "GET_PAGE_CONTENT") {
    // 获取当前标签页内容
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0]
      // 注入脚本获取页面文本
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.body.innerText
      })
      sendResponse({ content: results[0].result })
    })
    return true // 表示异步响应
  }
})
```

---

## 样式隔离

### 使用 Shadow DOM (Plasmo 默认)
Plasmo 的 CSUI 默认使用 Shadow DOM，样式与宿主页面隔离。

### 覆盖宿主页面样式
如果需要修改宿主页面样式:
```tsx
export const config: PlasmoCSConfig = {
  matches: ["https://claude.ai/*"],
  css: ["inject-styles.css"]  // 注入自定义 CSS
}
```

---

## 常见问题

### Q: 内容脚本无法访问 `window` 上的变量?
A: 这是设计如此。使用 `chrome.scripting.executeScript` 在主上下文执行代码。

### Q: 如何检测页面变化 (SPA)?
A: 使用 `MutationObserver`:
```tsx
const observer = new MutationObserver((mutations) => {
  // 检测 DOM 变化
})
observer.observe(document.body, { childList: true, subtree: true })
```

### Q: 注入的按钮被宿主 CSS 影响?
A: 确保使用 Plasmo 的 CSUI (Shadow DOM) 或内联样式。
