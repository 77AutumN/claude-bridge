# Claude-Bridge

> 让 Claude 网页版拥有「眼睛」— 读取当前浏览器标签页内容的 Chrome 扩展

## 项目概述
- **类型**: Chrome 扩展 (Manifest V3)
- **框架**: Plasmo (React + TypeScript)
- **来源**: 情报系统 Trend Jacking 分析

## 核心功能
1. 在 `claude.ai` 页面注入「Bridge」按钮
2. 点击按钮 → 捕获当前活跃标签页的标题、URL 和正文
3. 自动粘贴捕获内容到 Claude 输入框

## 商业逻辑
- **主线**: 流量套利 (邮件列表 / 付费 Newsletter)
- **副线**: 捐赠 (Buy me a Coffee / Crypto)
- **退出**: 用户积累后出售 (MicroAcquire)

## 开发状态
- [ ] 项目初始化
- [ ] 内容脚本注入
- [ ] 后台脚本实现
- [ ] UI 优化
- [ ] Chrome Web Store 发布

## 相关文档
- [任务计划书](../handover_inbox/ClaudeBridge_MissionPlan.md)
- [实现计划](./implementation_plan.md)
