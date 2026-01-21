---
description: 处理来自移交收件箱的任务计划书并初始化新项目
---

# 移交处理工作流 (Process Handover Workflow)

1.  **读取计划**: 识别 `handover_inbox/` 中的目标文件。
2.  **提取元数据**: 确定项目名称、技术栈和 MVP 目标。
3.  **创建目录**: 创建 `projects/[项目名称]`。
4.  **初始化**:
    -   为项目创建 `README.md`。
    -   根据任务计划书创建 `implementation_plan.md`。
5.  **通知**: 通知用户项目已准备就绪，可以开始实施。
