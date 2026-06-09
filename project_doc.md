智能胸部X光报告生成与管理系统 - 产品需求文档 (PRD)
1. 项目概述
本项目是一个面向影像科医生的智能辅助工作站。系统通过接入轻量级深度学习模型（提取结构化 Schema）和微调后的大语言模型（如 Qwen2.5），根据患者的正/侧位胸部 X 光片自动生成自然语言的医疗报告。系统旨在提供低认知负担的阅片体验、可靠的 AI 解释性（注意力图），以及完整的病例数据闭环。

2. 技术栈架构与开发规范
2.1 前端 (Client-Side)
核心框架: React 18 + Vite + TypeScript (开启严格模式)。

UI 与样式: Tailwind CSS + Shadcn UI (构建医疗级暗黑/护眼主题)。

状态管理: Zustand (用于跨组件共享患者上下文、模型加载状态)。

富文本编辑: Tiptap (构建无头编辑器，支持打字机流式渲染效果)。

图像渲染: HTML5 原生 Canvas 或 Fabric.js (用于实现图片缩放、拖拽，及热力图图层叠加)。

2.2 后端 (Server-Side / AI Gateway)
核心框架: FastAPI (Python)，强制使用异步 (async/await) 处理路由。

数据库引擎: SQLite (本地单文件) + SQLModel (基于 Pydantic 的 ORM 框架)。

AI 接口规范:

提供基于 SSE (Server-Sent Events) 的流式输出接口，用于 Qwen2.5 的报告生成。

提供独立接口用于生成病灶注意力热力图 (Attention Map)，如 Grad-CAM 结果。

部署环境建议: 云端 GPU 算力实例（推荐利用 Tailscale 构建安全的虚拟局域网，前端直连云端内网 IP）。

3. 核心数据模型 (Database Schema)
请后端基于 SQLModel 实现以下核心表结构：

1. Patient (患者表)

patient_id (String, 主键, 例如: P20260601)

name (String, 姓名)

gender (String, 性别)

age (Integer, 年龄)

created_at (DateTime, 录入时间)

2. Report (检查报告表)

report_id (String, 主键)

patient_id (String, 外键，关联 Patient)

image_paths (JSON, 存储正侧位原图的服务器存储路径或 URL)

schema_data (JSON, 轻量级模型提取的中间态结构化数据)

findings (Text, 影像所见)

impression (Text, 影像诊断)

ai_advice (Text, 附加医嘱/注意事项)

attention_map_paths (JSON, 热力图缓存路径，可为空)

created_at (DateTime, 生成时间)

3. ShortcutTemplate (快捷短语表)

id (Integer, 主键)

trigger_code (String, 触发词，如 "/zc")

content (String, 替换内容，如 "心肺未见明显异常")

4. UI 路由与页面布局结构
系统采用 SPA（单页应用）架构，外层包裹 <AppLayout>，左侧固定全局侧边栏 (Sidebar，宽度 64px)，右侧为动态路由视图。

4.1 核心工作台 (/workspace)
布局: 100vh 全屏沉浸式，横向三栏流式布局 (可拖拽调整列宽)。

左栏 - 阅片区 (30%):

支持上下排列拖放两张图像（正位、侧位）。

图像容器内提供：缩放比例提示、重置视图按钮。

悬浮按钮：[生成注意力图]，点击后通过 Canvas 覆盖红色高亮热力图层，提供 Slider 调节不透明度。

中栏 - 报告编辑区 (45%):

顶部：[一键生成报告] 按钮（触发 AI 流式生成）。

编辑器区域划分：包含“影像所见”和“影像诊断”两个主要 Block。

底部操作栏：[清空当前]、[💾 归档保存] (点击弹出关联患者模态框)。

右栏 - AI 助手区 (25%):

聊天气泡列表：展示与 Qwen2.5 的对话上下文。

底部输入框：支持文本输入。

特殊交互：当 AI 输出包含可作为医嘱的内容时，气泡下方渲染 [插入到医嘱栏] 幽灵按钮，点击后自动追加到中栏编辑器末尾。

4.2 病例管理中心 (/cases)
布局: 顶部搜索/过滤区 + 底部数据表格。

功能:

基于 Patient 和 Report 表的数据联查展示。

搜索框支持按患者编号或姓名模糊查询。

表格行操作：点击 [查看详情] 右侧滑出 Drawer 展示完整报告图文；点击 [复诊] 携带患者 ID 跳转至 /workspace 页面并自动填入基础信息。

4.3 系统设置 (/settings)
布局: 左侧导航菜单 + 右侧表单。

配置项: 主题外观切换（明暗色）、快捷指令 CRUD 管理、大模型提示词 (Prompt) 预设模板调整。

5. 核心业务流转逻辑 (关键执行流)
5.1 报告生成工作流 (Two-Stage Generation)
用户拖入两张图片至前端阅片区。

前端将图片转换为 Base64 或 multipart/form-data 发送至 FastAPI 端点。

Stage 1: FastAPI 调用轻量级视觉模型，输出 JSON 格式的结构化特征 (Schema Data)。

Stage 2: FastAPI 将 Schema Data 结合预设 Prompt 喂给微调后的 Qwen2.5。

FastAPI 通过 StreamingResponse 将 Qwen2.5 的输出逐字返回。

前端 Zustand 监听到文本流，通过 Tiptap 渲染出打字机效果。

5.2 医患数据打通与归档流
用户在工作台点击归档，前端弹出模态框 (Modal)。

用户选择“新建患者”或搜索关联“已有患者ID”。

前端汇总图片路径、最终版报告文本 (支持医生手动修改后的 Diff)、AI 建议，组装为 payload 发送至存储接口。

数据库持久化，并提示“已准备好下一次阅片”。

6. 给 Cursor 的开发步骤建议 (Phase Breakdown)
提示 Cursor 按照以下步骤递进开发，避免一次性生成过多出错代码：

Phase 1: 基础设施 - 初始化 Vite+React 环境，配置 Tailwind, Shadcn UI, React Router, Zustand。搭建带有侧边栏的基础 Layout。

Phase 2: 页面骨架 - 实现 /workspace 的三栏静态布局，/cases 的静态表格，/settings 的基础表单。

Phase 3: 影像与编辑器 - 引入 Tiptap 并配置富文本支持，实现在左侧区域拖拽上传图像并用 Canvas 渲染，跑通前端图像预览功能。

Phase 4: 后端 API 与流式交互 - 建立 FastAPI 框架，配置 SQLModel 表结构。实现前端调用后端 SSE 接口，测试中栏的打字机报告渲染。

Phase 5: 高级功能打磨 - 实现注意力图层叠加算法、右侧 AI 助手的对话注入功能、保存归档的模态框以及病例查询逻辑。