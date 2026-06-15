智能胸部X光报告生成与管理系统 - 产品需求文档 (PRD)
1. 项目概述
本项目是一个面向影像科医生的智能辅助工作站。系统通过接入轻量级深度学习模型（提取结构化 Schema）和微调后的大语言模型（如 Qwen2.5），根据患者的正/侧位胸部 X 光片自动生成自然语言的医疗报告。系统旨在提供低认知负担的阅片体验、可靠的 AI 解释性（注意力图），以及完整的病例数据闭环。

2. 技术栈架构与部署拓扑 (Architecture & Topology)
本系统采用标准的B/S（Browser/Server）集中式 Web 服务架构。所有的代码（前端静态资源、后端业务逻辑、AI模型）全部集中部署在实验室的高性能 GPU 服务器上。用户端做到真正的“零安装”，仅需通过浏览器访问网址即可使用。

2.1 客户端层 (Client-Side / 用户浏览器)
形态: 纯网页。用户使用任意设备的 Web 浏览器访问系统。

技术栈: React 18 + Vite + Tailwind CSS + Zustand 编译打包后的静态 HTML/CSS/JS 文件。

职责: 在用户浏览器中渲染 UI 并接管交互逻辑，向服务器的公开 API 发起 HTTP 请求。

2.2 服务端层 (Server-Side / 实验室 GPU 服务器)
在物理服务器内部，系统被划分为三个核心模块协同工作：

模块 0：静态资源网关 (Web Server)

职责: 将前端 React 项目编译后的 dist 目录托管对外发布。可以使用 Nginx 进行反向代理，或者直接在 FastAPI (模块A) 中使用 StaticFiles 挂载前端页面。

模块 A：业务网关与数据库服务 (Business Service - 端口 8000)

技术栈: FastAPI + SQLModel + SQLite。

职责: 永不崩溃的轻量级业务大脑。处理前端发来的 CRUD 请求，读写本地 medical_app.db，保存多轮对话历史 (chat_history)。它对外暴露 API，对内负责向 GPU 推理服务发起调度请求，并将大模型的流式文本中继转发给前端。

模块 B：GPU 推理微服务 (Inference Service - 端口 8001)

技术栈: FastAPI + PyTorch + Qwen2.5/轻量级模型。

职责: 专职的“显存苦力”。与业务完全隔离，仅暴露内网纯计算 API（如 /api/model/extract_schema）。不连接任何数据库，专门防止 OOM（显存溢出）波及整个网站。

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
7. 系统整体架构与部署拓扑 (System Architecture & Topology)
本系统采用“云端算力分离 + 虚拟局域网直连”的敏捷架构。前端在本地设备运行以保证极致的交互体验，重度 AI 推理和数据持久化运行在远端 GPU 服务器（AutoDL）上，两者通过 Tailscale 构建的安全加密隧道进行通信。

7.1 系统逻辑分层架构
系统自上而下划分为三个主要逻辑层：

表现层 (客户端 / 本地运行)

核心: React 18 + Vite SPA (单页应用)。

职责: 负责高保真的医疗 UI 渲染（Shadcn UI + Tailwind）、图像的本地预览与交互处理（Canvas 注意力图叠加）、以及通过 Zustand 管理多页面间共享的“当前阅片患者上下文”。

特点: 无任何重度计算，所有请求通过异步 API 发送。

网关与业务控制层 (服务端 / AutoDL 运行)

核心: FastAPI (Python) + SQLite。

职责:

提供 RESTful API 与前端交互。

通过 SQLModel (ORM) 管理本地 SQLite 数据库（患者信息、报告记录）。

作为模型网关，接收前端图片，调度底层 AI 模型，并将结果组装返回。

AI 模型推理层 (服务端 GPU / AutoDL 运行)

职责: 执行高并发、大显存需求的深度学习任务。包含两条流水线：

Stage 1: 原生 PyTorch 加载轻量级 CNN/ViT 模型，提取图像特征，输出包含 anatomy, observation, attributes, state 的结构化 Schema JSON。

Stage 2: 接收 Schema 数据并拼接 Prompt，送入预加载在显存中的 Qwen2.5 大语言模型，利用 StreamingResponse (SSE) 生成自然语言流。

7.2 物理部署与网络拓扑
由于医疗影像的隐私敏感性及云端服务器无公网 IP 的限制，系统采用以下组网方案：

Plaintext
[ 本地工作站 (Local PC) ]                        [ 远端算力节点 (AutoDL 实例) ]
                                            |
+--------------------------+                |    +--------------------------------+
|    Web 浏览器 / 客户端   |                |    |      FastAPI 后端服务 (8000)   |
|                          |                |    |                                |
|  - 页面渲染              |  << HTTP >>    |    |  +--------------------------+  |
|  - Zustand 状态          |  (API 调用)    |    |  | SQLite 数据库 (本地文件) |  |
|  - 图片拖拽上传          |================|==> |  +--------------------------+  |
|                          |   Tailscale    |    |                                |
| (Vite Server: localhost) |  虚拟局域网    |    |  +--------------------------+  |
+--------------------------+   (100.x.x.x)  |    |  | GPU 显存池               |  |
                                            |    |  |  - 轻量级 Schema 模型    |  |
                                            |    |  |  - Qwen2.5 微调模型      |  |
                                            |    |  +--------------------------+  |
                                            |    +--------------------------------+
7.3 核心业务数据流 (End-to-End Data Flow)
以下是“一键生成报告”时的完整数据链路：

[前端] 发起: 医生拖入 2 张 X 光片，点击生成。前端通过 FormData 将图像转换为文件流，POST 至 FastAPI 的 /api/generate-schema。

[后端] 预处理与特征提取: FastAPI 接收图片，执行尺寸规范化 (如 224x224) 与 Normalize，转换为 Tensor 喂给轻量级 PyTorch 模型。

[后端] 组装 Prompt: 提取出 Schema JSON（List 格式）后，后端结合系统预设的放射科医生 Prompt 模板，将其拼接为大模型上下文。

[后端] LLM 流式推理: 调用 Qwen2.5 接口。随着 GPU 计算，Qwen2.5 吐出的每一个 Token 通过 SSE (Server-Sent Events) 实时推给前端。

[前端] 响应渲染: 前端的富文本编辑器 (Tiptap) 监听到 SSE 流，以“打字机”效果逐字渲染报告，直到生成完毕。

[后端] 归档落地: 医生点击保存后，前端发送最终确定的文本与图片路径，后端将其写入 SQLite Report 表与 Patient 表。

8. 项目核心文件结构与部署拓扑
8.1 物理拓扑网络
用户端与实验室服务器通过局域网/校园网（或公网IP）进行通信，服务器内部通过环回地址（127.0.0.1）进行微服务间通信。

Plaintext
[ 医生电脑 / 浏览器 ]  === HTTP 请求 ===>  [ 实验室 GPU 服务器 (Ubuntu) ]
(输入 http://服务器IP)                           |
                                            |-- [ Web 代理 / 挂载点 ] 返回 React 打包的静态页面
                                            |
                                            |-- [ 进程 A: 8000 端口 ] 业务后端 & SQLite
                                            |       | (内网 HTTP 请求转发)
                                            |-- [ 进程 B: 8001 端口 ] 独占 GPU 的模型推理后端
8.2 全栈代码库结构 (部署于实验室服务器)
整个项目的代码统一存放在实验室服务器的指定工作空间下。

Plaintext
/workplace/CXRG/
│
├── my_medical_frontend/     # 前端工程目录
│   ├── src/                 # React 源码 (页面、组件、Zustand Store)
│   ├── package.json
│   └── dist/                # 🚀 执行 npm run build 后生成的生产环境静态文件
│
└── my_medical_backend/      # 后端工程目录
    ├── data/                # 存放 SQLite 数据库文件 (medical_app.db)
    ├── models/              # 存放所有深度学习模型权重
    │
    ├── business_service/    # 🚀 进程 A: 业务后端 (运行在 8000 端口)
    │   ├── main_biz.py      # 业务入口 (挂载前端dist目录、注册CRUD路由)
    │   ├── database.py      # SQLite 引擎初始化
    │   ├── models_db.py     # 数据表结构定义 (包含 chat_history 字段)
    │   └── routers/         # API 路由拆分
    │
    └── inference_service/   # 🚀 进程 B: 推理后端 (运行在 8001 端口)
        ├── main_infer.py    # 推理入口 (加载模型到显存)
        ├── schema_extractor.py 
        └── text_generator.py