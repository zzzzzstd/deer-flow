import React from "react"
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  CheckSquare,
} from "lucide-react"
import { createSuggestionItems, Command, renderItems } from "novel"

export const suggestionItems = createSuggestionItems([
  {
    title: "文本",
    description: "开始写作普通文本",
    searchTerms: ["p", "paragraph", "text", "文本"],
    icon: <Type size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode("paragraph", "paragraph")
        .run()
    },
  },
  {
    title: "一级标题",
    description: "大标题",
    searchTerms: ["title", "big", "large", "h1", "标题", "大标题"],
    icon: <Heading1 size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 1 })
        .run()
    },
  },
  {
    title: "二级标题",
    description: "中等标题",
    searchTerms: ["subtitle", "medium", "h2", "副标题", "中标题"],
    icon: <Heading2 size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 2 })
        .run()
    },
  },
  {
    title: "三级标题",
    description: "小标题",
    searchTerms: ["small", "h3", "小标题"],
    icon: <Heading3 size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 3 })
        .run()
    },
  },
  {
    title: "无序列表",
    description: "创建一个简单的无序列表",
    searchTerms: ["unordered", "point", "list", "无序", "列表", "项目"],
    icon: <List size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
  },
  {
    title: "有序列表",
    description: "创建一个带数字的有序列表",
    searchTerms: ["ordered", "numbered", "list", "有序", "数字", "编号"],
    icon: <ListOrdered size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
  {
    title: "引用",
    description: "引用一段文字",
    searchTerms: ["blockquote", "quote", "引用", "引述"],
    icon: <Quote size={18} />,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode("paragraph", "paragraph")
        .toggleBlockquote()
        .run(),
  },
  {
    title: "代码块",
    description: "插入代码块",
    searchTerms: ["codeblock", "code", "代码", "代码块"],
    icon: <Code size={18} />,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: "待办事项",
    description: "创建待办事项列表",
    searchTerms: ["todo", "task", "list", "check", "checkbox", "待办", "任务"],
    icon: <CheckSquare size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run()
    },
  },
])

export const slashCommand = Command.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems,
  },
})
