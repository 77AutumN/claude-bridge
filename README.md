# 盈利项目执行器 (Project 工作区)

**目标**: 盈利项目的核心执行引擎。
**输入**: 情报工作区 (`D:\Intel_Briefing`) -> `handover_inbox/`
**输出**: 部署在 `projects/` 中的应用程序

## 🚀 活跃工作流
1.  **检查移交 (Check Handover)**: 查看 `handover_inbox/` 中是否有新的计划书。
2.  **运行工作流 (Run Workflow)**: 使用 `/process-handover` 启动新项目。
3.  **实现 (Implement)**: 在 `projects/[项目名称]` 中构建 MVP。

## 📂 目录结构
- `handover_inbox/`: 任务计划书 (Mission Plans) 的投放区。
- `projects/`: 活跃项目的实现目录。
- `src/`: 工作区自动化代理 (继承自 Antigravity Template)。
- `.agent/workflows/`: 标准作业程序 (SOP)。

## 🔗 快速链接
- [移交收件箱 (Handover Inbox)](handover_inbox/README.md)
- [项目列表 (Project List)](projects/README.md)
- [模板文档 (Template Documentation)](docs/en/README.md)

---
*基于 [Antigravity Workspace Template](https://github.com/study8677/antigravity-workspace-template)*
