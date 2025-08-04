# AI Editor Standalone

独立的AI编辑器组件，基于 Novel + TipTap + ProseMirror 技术栈。

## ✨ 功能特性

- 🎨 **完全独立** - 易于集成到任何项目
- 🤖 **AI 功能** - 内置 AI 工具栏和助手面板
- ⚡ **Slash 命令** - 输入 "/" 快速插入内容块
- 📝 **富文本编辑** - 支持标题、列表、引用、代码块等
- 🖼️ **图片上传** - 拖拽和粘贴图片支持
- ✅ **任务列表** - 交互式待办事项
- 📱 **响应式设计** - 适配各种屏幕尺寸
- 🌙 **深色模式** - 自动主题切换
- ⌨️ **键盘快捷键** - 高效的编辑体验
- 📄 **Markdown 输出** - 实时查看原生 Markdown 格式
- 🖱️ **流畅滚动** - 支持鼠标滚轮和键盘导航
- 💾 **导出功能** - 一键导出 Markdown 文件

## 🚀 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看演示。

## 📦 在其他项目中使用

### 1. 复制组件文件

将以下文件复制到你的项目中：

```
src/components/ai-editor/
├── index.tsx           # 主编辑器组件
├── extensions.ts       # TipTap 扩展配置
├── slash-command.tsx   # Slash 命令配置
├── ai-toolbar.tsx      # AI 工具栏
├── ai-assistant.tsx    # AI 助手面板
├── image-upload.ts     # 图片上传逻辑
└── ai-editor.css       # 样式文件
```

### 2. 安装依赖

```bash
npm install novel @tiptap/react tiptap-markdown lucide-react class-variance-authority tailwind-merge use-debounce
```

### 3. 使用组件

```tsx
import { AIEditor } from './components/ai-editor'
import type { JSONContent } from 'novel'

function MyApp() {
  const [content, setContent] = useState<JSONContent>()
  const [markdown, setMarkdown] = useState<string>('')

  return (
    <AIEditor
      placeholder="开始写作..."
      onContentChange={setContent}
      onMarkdownChange={setMarkdown}
    />
  )
}
```

### 4. 引入样式

确保在你的项目中引入样式文件：

```tsx
import './components/ai-editor/ai-editor.css'
```

## 🔧 API 参考

### AIEditor Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `initialContent` | `JSONContent` | - | 编辑器初始内容 |
| `placeholder` | `string` | `"开始写作..."` | 占位符文本 |
| `className` | `string` | `""` | 自定义CSS类名 |
| `onContentChange` | `(content: JSONContent) => void` | - | 内容变化回调 |
| `onMarkdownChange` | `(markdown: string) => void` | - | Markdown变化回调 |

## 🏗️ 技术架构

```
Novel (React 组件层)
  ↓
TipTap (扩展 API 层)  
  ↓
ProseMirror (核心引擎层)
```

## 📝 使用说明

### Slash 命令

在编辑器中输入 `/` 可以快速插入：

- 文本段落
- 标题（1-3级）
- 无序/有序列表
- 引用块
- 代码块
- 待办事项

### 图片上传

- 拖拽图片文件到编辑器
- 粘贴剪贴板中的图片
- 支持常见图片格式
- 最大文件大小：20MB

### 快捷键

- `Ctrl/Cmd + B` - 加粗
- `Ctrl/Cmd + I` - 斜体
- `Ctrl/Cmd + U` - 下划线
- `Ctrl/Cmd + Z` - 撤销
- `Ctrl/Cmd + Y` - 重做

## 🎨 自定义样式

编辑器使用 Tailwind CSS，你可以通过以下方式自定义样式：

1. 修改 `ai-editor.css` 文件
2. 通过 `className` 属性传入自定义类名
3. 覆盖 CSS 变量

## 📄 许可证

MIT License
