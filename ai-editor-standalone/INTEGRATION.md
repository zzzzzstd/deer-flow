# AI Editor 集成指南

## 🚀 快速集成

这个 AI 编辑器是完全独立的组件，可以轻松集成到任何 React 项目中。

### 1. 安装依赖

```bash
npm install novel @tiptap/react tiptap-markdown lucide-react class-variance-authority tailwind-merge use-debounce
```

### 2. 复制组件文件

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

### 3. 基础使用

```tsx
import { AIEditor } from '@/components/ai-editor'

function MyApp() {
  const [content, setContent] = useState()
  const [markdown, setMarkdown] = useState('')

  return (
    <div className="h-[600px]">
      <AIEditor
        placeholder="开始写作..."
        onContentChange={setContent}
        onMarkdownChange={setMarkdown}
        showToolbar={true}
        defaultMode="edit"
        className="h-full"
      />
    </div>
  )
}
```

### 4. 高级配置

```tsx
// 自定义初始内容
const initialContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text: "Hello World!" }]
    }
  ]
}

<AIEditor
  initialContent={initialContent}
  placeholder="开始写作..."
  onContentChange={(content) => {
    console.log('内容变化:', content)
  }}
  onMarkdownChange={(markdown) => {
    console.log('Markdown:', markdown)
  }}
  showToolbar={true}
  defaultMode="edit"
  className="h-full border rounded-lg"
/>
```

## 🎯 特性

- ✅ **完全独立** - 无需额外配置
- ✅ **AI 功能** - 内置 AI 工具栏和助手
- ✅ **Slash 命令** - 输入 "/" 快速插入内容
- ✅ **Markdown 支持** - 实时转换和导出
- ✅ **图片上传** - 拖拽和粘贴支持
- ✅ **任务列表** - 交互式待办事项
- ✅ **响应式设计** - 适配各种屏幕尺寸
- ✅ **深色模式** - 自动主题切换
- ✅ **键盘快捷键** - Ctrl+K 打开 AI 助手

## 🛠️ API 接口

### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `initialContent` | `JSONContent` | `undefined` | 初始编辑器内容 |
| `placeholder` | `string` | `"开始写作..."` | 占位符文本 |
| `className` | `string` | `""` | 自定义样式类 |
| `onContentChange` | `(content: JSONContent) => void` | `undefined` | 内容变化回调 |
| `onMarkdownChange` | `(markdown: string) => void` | `undefined` | Markdown 变化回调 |
| `showToolbar` | `boolean` | `true` | 是否显示工具栏 |
| `defaultMode` | `"edit" \| "preview"` | `"edit"` | 默认视图模式 |

### 事件

- **内容变化**: 编辑器内容实时更新
- **Markdown 导出**: 自动转换为 Markdown 格式
- **AI 交互**: 选中文字触发 AI 工具栏
- **快捷键**: Ctrl+K 打开 AI 助手面板

## 🎨 样式定制

编辑器使用 Tailwind CSS，你可以通过 `className` 属性自定义样式：

```tsx
<AIEditor
  className="border-2 border-blue-500 rounded-xl shadow-lg"
  // ... 其他属性
/>
```

## 📦 依赖说明

这个编辑器基于以下核心技术：

- **Novel**: 现代编辑器框架
- **TipTap**: 富文本编辑器核心
- **ProseMirror**: 底层编辑器引擎
- **Tailwind CSS**: 样式框架
- **Lucide React**: 图标库

所有依赖都是常用的、稳定的开源库，确保长期维护和兼容性。
