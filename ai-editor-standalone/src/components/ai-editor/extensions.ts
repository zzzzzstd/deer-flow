import {
  StarterKit,
  Placeholder,
  TiptapLink,
  TiptapUnderline,
  HighlightExtension,
  TextStyle,
  Color,
  GlobalDragHandle,
  TiptapImage,
  UploadImagesPlugin,
  TaskList,
  TaskItem,
} from "novel"
import { Markdown } from "tiptap-markdown"
import { uploadFn } from "./image-upload"

// 基础扩展配置
const starterKit = StarterKit.configure({
  bulletList: {
    HTMLAttributes: {
      class: "ai-editor-bullet-list",
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: "ai-editor-ordered-list",
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: "ai-editor-blockquote",
    },
  },
  code: {
    HTMLAttributes: {
      class: "ai-editor-code",
    },
  },
  heading: {
    HTMLAttributes: {
      class: "ai-editor-heading",
    },
  },
})

// 占位符配置
const placeholder = Placeholder.configure({
  placeholder: ({ node }) => {
    if (node.type.name === "heading") {
      return "标题"
    }
    return "开始写作..."
  },
})

// 链接配置
const link = TiptapLink.configure({
  HTMLAttributes: {
    class: "ai-editor-link",
  },
})

// 高亮配置
const highlight = HighlightExtension.configure({
  multicolor: true,
})

// 任务列表配置
const taskList = TaskList.configure({
  HTMLAttributes: {
    class: "ai-editor-task-list",
  },
})

const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: "ai-editor-task-item",
  },
})

// 图片配置
const tiptapImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [
      UploadImagesPlugin({
        imageClass: "ai-editor-image-uploading opacity-40 rounded-lg border border-gray-200",
      }),
    ]
  },
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: "ai-editor-image rounded-lg border border-gray-200 max-w-full h-auto",
  },
})

// 拖拽手柄配置
const globalDragHandle = GlobalDragHandle.configure({
  dragHandleWidth: 20,
})

// 配置 Markdown 支持
const markdown = Markdown.configure({
  html: true,
  tightLists: true,
  bulletListMarker: "-",
  linkify: false,
  breaks: false,
})

// 导出所有扩展
export const aiEditorExtensions = [
  starterKit,
  placeholder,
  link,
  TiptapUnderline,
  highlight,
  TextStyle,
  Color,
  markdown,
  taskList,
  taskItem,
  tiptapImage,
  globalDragHandle,
]

// 导出图片上传函数
export { uploadFn } from "./image-upload"
