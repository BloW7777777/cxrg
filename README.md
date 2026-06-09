# 医疗影像报告生成系统 - 前端

基于 React + TypeScript + Tailwind CSS + Shadcn UI 构建的医疗影像报告生成系统前端。

## 技术栈

- **框架**: React 18 + Vite + TypeScript
- **样式**: Tailwind CSS + Shadcn UI
- **图标**: Lucide React
- **布局**: react-resizable-panels (可拖拽调整列宽)

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
src/
├── components/
│   ├── ui/           # Shadcn UI 基础组件
│   ├── workspace/    # 工作台相关组件
│   │   ├── ImagePanel.tsx    # 左栏：阅片区
│   │   ├── ReportEditor.tsx  # 中栏：报告编辑区
│   │   └── AICopilot.tsx     # 右栏：AI 副驾驶
│   └── Sidebar.tsx   # 全局侧边栏
├── pages/
│   └── Workspace.tsx # 工作台主页面
├── lib/
│   └── utils.ts      # 工具函数
├── App.tsx           # 根组件
└── main.tsx          # 入口文件
```

## 核心功能

### 工作台 (Workspace)
- 三栏可调整布局 (30:45:25)
- 左栏：图像上传与预览
- 中栏：报告编辑
- 右栏：AI 助手对话

### UI 主题
- 深色医疗主题 (Slate-950)
- 冷色调配色方案
- 高对比度文字显示
