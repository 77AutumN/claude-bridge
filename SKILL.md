---
name: 盈利项目执行器 (Profit Project Executor)
description: 专门负责从情报系统接收并实现盈利项目的执行工作区。
---
# 盈利项目执行器 (Profit Project Executor)

本工作区是盈利项目的“执行引擎”。它位于情报工作区 (`D:\Intel_Briefing`) 的下游，专注于将计划转化为产品。

## 核心工作流

### 1. 接收 (Handover)
- **来源**: 任务计划书 (Mission Plans) 被投递至 `handover_inbox/`。
- **动作**: 运行 `process_handover` 工作流来分析并搭建项目脚手架。

### 2. 实现 (Implementation)
- **位置**: `projects/[项目名称]/`。
- **标准**: 遵循 `Web Application Development` 指南或特定的项目需求。
- **重点**: 快速实现 MVP (最小可行性产品)，代码质量，以及商业逻辑（Revenue Logic）。

### 3. 验证与发布 (Verification & Launch)
- **动作**: 根据任务计划书中的“成功标准 (Success Criteria)”进行验证。
- **交付物**: 已部署的应用程序或可分发的制品。

## 目录结构
- `handover_inbox/`: 接收来自情报系统的任务计划书的着陆区。
- `projects/`: 每个活跃项目的专用文件夹。
- `.agent/workflows/`: 用于项目设置和管理的自动化工作流脚本。
- `src/`: 工作区级别的实用工具代理 (Utility Agents)。

## 语言规范
- **所有文档、报告及沟通均使用中文。**
