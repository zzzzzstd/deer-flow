# AI Editor Standalone 使用指南

## 🚀 新功能使用指南

### 📊 表格功能

#### 创建表格
1. **通过 Slash 命令**：
   - 在编辑器中输入 `/`
   - 选择 "表格" 选项
   - 自动创建 3x3 的表格（包含表头）

2. **通过工具栏**：
   - 选中任意文字
   - 在弹出的工具栏中点击表格图标

#### 编辑表格
- **添加行**：选中表格单元格后，工具栏会显示 `+` 按钮
- **删除行**：选中表格单元格后，工具栏会显示 `-` 按钮  
- **添加列**：选中表格单元格后，工具栏会显示列操作按钮
- **调整列宽**：拖拽表格边框可调整列宽

#### 表格样式
- 自动适配深色/浅色主题
- 悬停高亮效果
- 选中单元格高亮
- 响应式布局

### 🎨 动画效果

#### 界面动画
- **编辑器加载**：淡入 + 向上滑动动画
- **模式切换**：编辑/预览模式平滑过渡
- **AI 助手**：弹出式动画效果
- **工具栏**：悬停时的微动效果

#### 自定义动画
所有动画基于 `framer-motion`，可以通过修改组件中的动画参数来自定义：

```tsx
// 示例：修改编辑器加载动画
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```

### 🎯 Tailwind CSS v4

#### 新特性
- **PostCSS 配置**：更简洁的配置方式
- **更好的性能**：更快的构建速度
- **现代语法**：支持最新的 CSS 特性

#### 自定义样式
项目使用 Tailwind CSS v4，可以直接在组件中使用 Tailwind 类名：

```tsx
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl">
  {/* 内容 */}
</div>
```

## 🛠️ 开发指南

### 添加新的表格功能

1. **扩展表格命令**：
```tsx
// 在 ai-toolbar.tsx 中添加新按钮
<EditorBubbleItem
  onSelect={(editor) => {
    editor.chain().focus().mergeCells().run()
  }}
>
  <button title="合并单元格">
    <MergeIcon className="h-4 w-4" />
  </button>
</EditorBubbleItem>
```

2. **添加表格样式**：
```css
/* 在 ai-editor.css 中添加样式 */
.ai-editor-container .ProseMirror table .merged-cell {
  background-color: #f3f4f6;
}
```

### 自定义动画

1. **添加新动画**：
```tsx
import { motion } from "framer-motion"

<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ type: "spring", stiffness: 300 }}
>
  {/* 内容 */}
</motion.div>
```

2. **动画预设**：
```tsx
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}
```

### 样式自定义

1. **主题颜色**：
```css
/* 在 ai-editor.css 中自定义 */
.ai-editor-container {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
}
```

2. **响应式设计**：
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 响应式网格 */}
</div>
```

## 🔧 故障排除

### 常见问题

1. **表格功能不工作**：
   - 确保已安装所有依赖：`npm install`
   - 检查是否正确导入了表格扩展

2. **动画效果不显示**：
   - 确保 `framer-motion` 已正确安装
   - 检查是否在 SSR 环境中正确处理

3. **样式问题**：
   - 确保 Tailwind CSS v4 配置正确
   - 检查 PostCSS 配置文件

### 性能优化

1. **减少动画开销**：
```tsx
// 使用 transform 而不是改变布局属性
<motion.div
  animate={{ x: 100 }} // ✅ 好
  // animate={{ left: 100 }} // ❌ 避免
>
```

2. **表格性能**：
- 避免在大表格中使用复杂的样式
- 使用虚拟滚动处理大量数据

## 📚 更多资源

- [TipTap 表格文档](https://tiptap.dev/api/extensions/table)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [Tailwind CSS v4 文档](https://tailwindcss.com/docs)
