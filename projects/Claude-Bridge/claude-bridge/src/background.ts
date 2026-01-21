// Background Service Worker
// 处理来自内容脚本的消息，捕获活跃标签页内容

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "CAPTURE_ACTIVE_TAB") {
        handleCaptureActiveTab(sender.tab?.id)
            .then(sendResponse)
            .catch(error => {
                console.error("Capture error:", error)
                sendResponse({ success: false, error: error.message })
            })
        return true // 表示异步响应
    }
})

async function handleCaptureActiveTab(senderTabId?: number): Promise<{
    success: boolean
    title?: string
    url?: string
    content?: string
    error?: string
}> {
    try {
        // 获取所有标签页，找到最近活跃的非 Claude 标签页
        const tabs = await chrome.tabs.query({ currentWindow: true })

        // 过滤掉 Claude 页面和扩展页面
        const targetTab = tabs.find(tab =>
            tab.id !== senderTabId &&
            tab.url &&
            !tab.url.includes("claude.ai") &&
            !tab.url.startsWith("chrome://") &&
            !tab.url.startsWith("chrome-extension://")
        )

        if (!targetTab || !targetTab.id) {
            return {
                success: false,
                error: "未找到可读取的标签页。请确保有其他网页标签页打开。"
            }
        }

        // 在目标标签页执行脚本提取内容
        const results = await chrome.scripting.executeScript({
            target: { tabId: targetTab.id },
            func: extractPageContent
        })

        const content = results[0]?.result || ""

        return {
            success: true,
            title: targetTab.title || "无标题",
            url: targetTab.url || "",
            content: content
        }
    } catch (error) {
        console.error("Capture failed:", error)
        return {
            success: false,
            error: `捕获失败: ${error instanceof Error ? error.message : String(error)}`
        }
    }
}

// 在目标页面执行的函数：提取页面主要内容
function extractPageContent(): string {
    // 尝试获取 article 或 main 标签内容
    const article = document.querySelector("article")
    if (article) {
        return cleanText(article.innerText)
    }

    const main = document.querySelector("main")
    if (main) {
        return cleanText(main.innerText)
    }

    // 尝试获取 readme 内容 (GitHub)
    const readme = document.querySelector(".markdown-body")
    if (readme) {
        return cleanText((readme as HTMLElement).innerText)
    }

    // 后备方案: 获取 body 文本，但限制长度
    const bodyText = document.body.innerText
    return cleanText(bodyText, 10000) // 限制 10000 字符
}

function cleanText(text: string, maxLength?: number): string {
    // 清理多余空白
    let cleaned = text
        .replace(/\n{3,}/g, "\n\n")  // 多个换行变成两个
        .replace(/[ \t]+/g, " ")      // 多个空格变成一个
        .trim()

    if (maxLength && cleaned.length > maxLength) {
        cleaned = cleaned.substring(0, maxLength) + "\n\n[内容已截断...]"
    }

    return cleaned
}

export { }
