# AI Editor Standalone

基于 Novel + Tiptap + ProseMirror 技术栈的独立AI编辑器组件，集成了真实的AI功能。

## ✨ 功能特性

### 🤖 AI功能
- **改进文字**：让文字更清晰、更有说服力
- **缩短内容**：保持核心意思，使内容更简洁
- **扩展内容**：添加更多细节和例子
- **修正语法**：检查并修正语法和表达
- **继续写作**：基于当前内容继续写作
- **自定义命令**：输入自定义AI指令

### 📝 编辑功能
- 富文本编辑（标题、列表、引用、代码块等）
- **表格编辑** - 完整的表格创建、编辑和格式化
- Slash命令快速插入内容
- 图片拖拽上传
- 任务列表
- **流畅动画** - 基于 framer-motion 的界面过渡
- **现代样式** - 优化的 Tailwind CSS 配置
- Markdown实时导出
- 多视图模式（编辑/预览）

### ⌨️ 使用方法
1. **选中文字**：在编辑器中选中任意文字
2. **点击AI按钮**：选中文字后会出现工具栏，点击紫色的"AI"按钮
3. **选择AI功能**：在弹出的AI助手中选择功能或输入自定义指令

### 🎯 快捷键
- `Ctrl+K` / `Cmd+K`：打开AI助手
- `/`：打开Slash命令菜单
- 选中文字后：显示格式化工具栏（包含表格操作）

## 🚀 快速开始

### 1. 安装依赖

```bash
# 使用提供的安装脚本（推荐）
./scripts/install-deps.sh

# 或手动安装
npm install
# 或
yarn install
```

### 2. 配置环境变量

复制环境变量示例文件：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，配置AI后端地址：

```env
# AI 后端服务配置（web项目的地址）
NEXT_PUBLIC_AI_BACKEND_URL=http://localhost:8002
```

### 3. 启动web项目后端

**重要：** 在启动ai-editor-standalone之前，请确保web项目的后端服务正在运行：

```bash
# 在web项目目录中
cd ../web
npm run dev
```

确保web项目运行在 `http://localhost:8002`

### 4. 启动AI编辑器

```bash
npm run dev
```

访问 `http://localhost:3001` 查看AI编辑器演示。

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
