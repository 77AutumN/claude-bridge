import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
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

// 不使用 inline anchor，改为固定位置悬浮
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
        // 格式化捕获的内容 - 简化格式，避免 markdown 干扰
        const formattedContent = `[来源: ${response.title}]
[URL: ${response.url}]

${response.content}`.trim()

        // 尝试插入到 Claude 输入框
        const editor = document.querySelector('[contenteditable="true"]') as HTMLElement
        if (editor) {
          // 聚焦编辑器
          editor.focus()

          // 使用 clipboard API 粘贴 (更可靠)
          await navigator.clipboard.writeText(formattedContent)
          document.execCommand('paste')

          setStatus("📋 已复制，请按 Ctrl+V 粘贴")
        } else {
          // 复制到剪贴板作为后备方案
          await navigator.clipboard.writeText(formattedContent)
          setStatus("📋 已复制，请粘贴")
        }
      } else {
        setStatus("❌ " + (response.error || "捕获失败"))
      }
    } catch (error) {
      console.error("Bridge error:", error)
      // 尝试后备方案
      setStatus("📋 请手动粘贴 (Ctrl+V)")
    } finally {
      setIsLoading(false)
      // 5秒后清除状态
      setTimeout(() => setStatus(""), 5000)
    }
  }

  return (
    <div
      className="plasmo-fixed plasmo-bottom-24 plasmo-right-6 plasmo-z-[9999] plasmo-flex plasmo-flex-col plasmo-items-end plasmo-gap-2"
    >
      {status && (
        <span className="plasmo-text-xs plasmo-text-gray-700 plasmo-bg-white plasmo-px-3 plasmo-py-1.5 plasmo-rounded-lg plasmo-shadow-lg plasmo-border plasmo-border-gray-200">
          {status}
        </span>
      )}
      <button
        onClick={handleBridgeClick}
        disabled={isLoading}
        className={`
          plasmo-px-4 plasmo-py-2.5 
          plasmo-rounded-full plasmo-font-semibold plasmo-text-sm
          plasmo-transition-all plasmo-duration-200
          ${isLoading
            ? 'plasmo-bg-gray-400 plasmo-cursor-not-allowed'
            : 'plasmo-bg-gradient-to-r plasmo-from-orange-500 plasmo-to-amber-500 hover:plasmo-from-orange-600 hover:plasmo-to-amber-600 hover:plasmo-scale-105'
          }
          plasmo-text-white plasmo-shadow-lg hover:plasmo-shadow-xl
          plasmo-border-0
        `}
        title="读取其他标签页的内容并粘贴到输入框"
      >
        {isLoading ? "⏳" : "📥"} Bridge
      </button>
    </div>
  )
}

export default ClaudeBridgeButton
