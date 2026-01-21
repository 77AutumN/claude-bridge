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
        // 获取当前窗口的所有标签页
        const tabs = await chrome.tabs.query({ currentWindow: true })

        // 过滤掉 Claude 页面和扩展页面
        const validTabs = tabs.filter(tab =>
            tab.id !== senderTabId &&
            tab.url &&
            !tab.url.includes("claude.ai") &&
            !tab.url.startsWith("chrome://") &&
            !tab.url.startsWith("chrome-extension://")
        )

        if (validTabs.length === 0) {
            return {
                success: false,
                error: "未找到可读取的标签页。请确保有其他网页标签页打开。"
            }
        }

        // 选择 Claude 标签页左边的第一个标签页，如果左边没有则选右边第一个
        // 找到 Claude 标签页的索引
        const claudeTab = tabs.find(tab => tab.id === senderTabId)
        const claudeIndex = claudeTab?.index || 0

        // 按索引排序
        validTabs.sort((a, b) => (a.index || 0) - (b.index || 0))

        // 优先选择 Claude 左边的标签页（索引更小的）
        let targetTab = validTabs.filter(tab => (tab.index || 0) < claudeIndex).pop()

        // 如果左边没有，选择右边第一个
        if (!targetTab) {
            targetTab = validTabs.find(tab => (tab.index || 0) > claudeIndex)
        }

        // 还是没有的话，选第一个有效标签页
        if (!targetTab) {
            targetTab = validTabs[0]
        }

        if (!targetTab || !targetTab.id) {
            return {
                success: false,
                error: "未找到可读取的标签页。"
            }
        }

        // 在目标标签页执行脚本提取内容
        // 注意：这个函数必须完全自包含，不能引用外部变量或函数
        const results = await chrome.scripting.executeScript({
            target: { tabId: targetTab.id },
            func: () => {
                // ========== 完全自包含的提取函数 ==========

                // 清理文本的内联函数
                const cleanText = (text: string, maxLength?: number): string => {
                    let cleaned = text
                        .replace(/\n{3,}/g, "\n\n")
                        .replace(/[ \t]+/g, " ")
                        .replace(/\n /g, "\n")
                        .trim()

                    const limit = maxLength || 15000
                    if (cleaned.length > limit) {
                        cleaned = cleaned.substring(0, limit) + "\n\n[内容已截断...]"
                    }
                    return cleaned
                }

                // 尝试多种选择器
                const selectors = [
                    "article",
                    "main",
                    ".markdown-body",
                    "#mw-content-text",      // Wikipedia
                    ".mw-parser-output",     // Wikipedia
                    "#content",
                    "#main-content",
                    ".content",
                    ".post-content",
                    ".article-content",
                    ".entry-content",
                    "[role='main']"
                ]

                for (const selector of selectors) {
                    const element = document.querySelector(selector)
                    if (element) {
                        const text = (element as HTMLElement).innerText?.trim()
                        if (text && text.length > 100) {
                            return cleanText(text)
                        }
                    }
                }

                // 后备方案：获取 body 内容，移除导航等
                try {
                    const bodyClone = document.body.cloneNode(true) as HTMLElement
                    const removeSelectors = ["nav", "header", "footer", "aside", ".sidebar", ".navigation", ".menu", "script", "style", "noscript", "iframe"]
                    removeSelectors.forEach(sel => {
                        bodyClone.querySelectorAll(sel).forEach(el => el.remove())
                    })
                    const bodyText = bodyClone.innerText
                    if (bodyText && bodyText.length > 50) {
                        return cleanText(bodyText, 15000)
                    }
                } catch (e) {
                    // ignore
                }

                // 最后后备：直接获取 body
                return cleanText(document.body.innerText || "", 15000)
            }
        })

        const content = results[0]?.result || ""

        // 如果内容为空或太短，提示用户
        if (!content || content.length < 50) {
            return {
                success: true,
                title: targetTab.title || "无标题",
                url: targetTab.url || "",
                content: `[页面内容较少或无法提取]\n\n提取到 ${content.length} 字符`
            }
        }

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

export { }
