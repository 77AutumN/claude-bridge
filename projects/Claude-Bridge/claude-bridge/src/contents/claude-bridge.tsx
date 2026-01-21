import cssText from "data-text:~style.css"
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import { useState } from "react"

// 仅在 claude.ai 上运行
export const config: PlasmoCSConfig = {
  matches: ["https://claude.ai/*"],
  run_at: "document_idle"
}

// 样式处理 (rem -> px 转换，适配 Shadow DOM)
export const getStyle = (): HTMLStyleElement => {
  const baseFontSize = 16
  let updatedCssText = cssText.replaceAll(":root", ":host(plasmo-csui)")
  const remRegex = /([\d.]+)rem/g
  updatedCssText = updatedCssText.replace(remRegex, (match, remValue) => {
    const pixelsValue = parseFloat(remValue) * baseFontSize
    return `${pixelsValue}px`
  })
  const styleElement = document.createElement("style")
  styleElement.textContent = updatedCssText
  return styleElement
}

// 尝试找到 Claude 的输入框区域作为锚点
export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
  // Claude 使用 ProseMirror 编辑器
  const inputArea = document.querySelector('[contenteditable="true"]')
  if (inputArea) {
    return inputArea.parentElement?.parentElement || inputArea.parentElement
  }
  return null
}

// Bridge 按钮组件
const ClaudeBridgeButton = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<string>("")

  const handleBridgeClick = async () => {
    setIsLoading(true)
    setStatus("正在捕获...")

    try {
      // 向 background script 发送消息
      const response = await chrome.runtime.sendMessage({ 
        action: "CAPTURE_ACTIVE_TAB" 
      })

      if (response.success) {
        // 格式化捕获的内容
        const formattedContent = `
---
📄 **来源页面**: ${response.title}
🔗 **URL**: ${response.url}
---

${response.content}
`.trim()

        // 尝试插入到 Claude 输入框
        const editor = document.querySelector('[contenteditable="true"]') as HTMLElement
        if (editor) {
          // 聚焦编辑器
          editor.focus()
          
          // 插入文本
          document.execCommand('insertText', false, formattedContent)
          
          setStatus("✅ 已插入")
        } else {
          // 复制到剪贴板作为后备方案
          await navigator.clipboard.writeText(formattedContent)
          setStatus("📋 已复制到剪贴板")
        }
      } else {
        setStatus("❌ " + (response.error || "捕获失败"))
      }
    } catch (error) {
      console.error("Bridge error:", error)
      setStatus("❌ 错误")
    } finally {
      setIsLoading(false)
      // 3秒后清除状态
      setTimeout(() => setStatus(""), 3000)
    }
  }

  return (
    <div className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-ml-2">
      <button
        onClick={handleBridgeClick}
        disabled={isLoading}
        className={`
          plasmo-px-3 plasmo-py-1.5 
          plasmo-rounded-lg plasmo-font-medium plasmo-text-sm
          plasmo-transition-all plasmo-duration-200
          ${isLoading 
            ? 'plasmo-bg-gray-400 plasmo-cursor-not-allowed' 
            : 'plasmo-bg-gradient-to-r plasmo-from-orange-500 plasmo-to-amber-500 hover:plasmo-from-orange-600 hover:plasmo-to-amber-600'
          }
          plasmo-text-white plasmo-shadow-md hover:plasmo-shadow-lg
          plasmo-border-0
        `}
        title="读取当前活跃标签页的内容"
      >
        {isLoading ? "⏳" : "📥"} Bridge
      </button>
      {status && (
        <span className="plasmo-text-xs plasmo-text-gray-600 plasmo-bg-white plasmo-px-2 plasmo-py-1 plasmo-rounded">
          {status}
        </span>
      )}
    </div>
  )
}

export default ClaudeBridgeButton
