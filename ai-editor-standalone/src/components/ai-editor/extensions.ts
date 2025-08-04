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
import { Extension } from "@tiptap/react"
import { Table } from "@tiptap/extension-table"
import { TableHeader } from "@tiptap/extension-table-header"
import { TableRow } from "@tiptap/extension-table-row"
import { TableCell } from "@tiptap/extension-table-cell"
import { slashCommand } from "./slash-command"
import { uploadFn } from "./image-upload"

// 自定义 AI 命令扩展
const AICommandExtension = Extension.create({
  name: "aiCommand",

  addKeyboardShortcuts() {
    return {
      // Ctrl/Cmd + K 触发 AI 助手
      "Mod-k": () => {
        // 触发 AI 助手的逻辑将在组件中处理
        const event = new CustomEvent("ai-assistant-trigger")
        document.dispatchEvent(event)
        return true
      },
      // Ctrl/Cmd + Shift + A 快速 AI 生成
      "Mod-Shift-a": () => {
        const event = new CustomEvent("ai-quick-generate")
        document.dispatchEvent(event)
        return true
      },
    }
  },

  addCommands() {
    return {
      // 添加 AI 高亮命令
      setAIHighlight:
        () =>
        ({ commands }) => {
          return commands.setHighlight({ color: "#3b82f6" })
        },
      // 移除 AI 高亮命令
      unsetAIHighlight:
        () =>
        ({ commands }) => {
          return commands.unsetHighlight()
        },
    }
  },
})

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
  openOnClick: false,
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
  nested: true,
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

// 配置表格支持
const table = Table.configure({
  resizable: true,
})

const tableRow = TableRow.configure()

const tableCell = TableCell.configure()

const tableHeader = TableHeader.configure()

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
  table,
  tableRow,
  tableCell,
  tableHeader,
  AICommandExtension,
  slashCommand,
  taskList,
  taskItem,
  tiptapImage,
  globalDragHandle,
]

// 导出扩展名称，方便在组件中使用
export const EXTENSION_NAMES = {
  AI_COMMAND: "aiCommand",
  SLASH_COMMAND: "slashCommand",
  HIGHLIGHT: "highlight",
  MARKDOWN: "markdown",
  TABLE: "table",
  TABLE_ROW: "tableRow",
  TABLE_CELL: "tableCell",
  TABLE_HEADER: "tableHeader",
  TASK_LIST: "taskList",
  TASK_ITEM: "taskItem",
  IMAGE: "image",
  DRAG_HANDLE: "globalDragHandle",
} as const

// 导出图片上传函数
export { uploadFn } from "./image-upload"
