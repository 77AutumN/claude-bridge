import "~style.css"

function IndexPopup() {
  return (
    <div className="plasmo-p-4 plasmo-w-72 plasmo-bg-gradient-to-br plasmo-from-orange-50 plasmo-to-amber-50">
      <div className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-mb-3">
        <span className="plasmo-text-2xl">🌉</span>
        <h1 className="plasmo-text-lg plasmo-font-bold plasmo-text-gray-800">
          Claude Bridge
        </h1>
      </div>

      <p className="plasmo-text-sm plasmo-text-gray-600 plasmo-mb-4">
        让 Claude 网页版拥有「眼睛」— 读取其他标签页的内容
      </p>

      <div className="plasmo-bg-white plasmo-rounded-lg plasmo-p-3 plasmo-shadow-sm plasmo-mb-4">
        <h2 className="plasmo-text-sm plasmo-font-semibold plasmo-text-gray-700 plasmo-mb-2">
          📖 使用方法
        </h2>
        <ol className="plasmo-text-xs plasmo-text-gray-600 plasmo-space-y-1 plasmo-list-decimal plasmo-list-inside">
          <li>打开想要读取的网页</li>
          <li>切换到 Claude.ai 标签页</li>
          <li>点击输入框旁的「📥 Bridge」按钮</li>
        </ol>
      </div>

      <div className="plasmo-text-center plasmo-pt-2 plasmo-border-t plasmo-border-gray-200">
        <a
          href="https://github.com/study8677"
          target="_blank"
          rel="noopener noreferrer"
          className="plasmo-text-xs plasmo-text-orange-500 hover:plasmo-text-orange-600 plasmo-no-underline"
        >
          ☕ 请我喝杯咖啡
        </a>
      </div>
    </div>
  )
}

export default IndexPopup
