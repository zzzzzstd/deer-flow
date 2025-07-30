// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import React from "react";
import {
  Command,
  createSuggestionItems,
  renderItems,
} from "novel";
import {
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Text,
  TextQuote,
  ImageIcon,
} from "lucide-react";

// 创建 slash 命令建议项
export const suggestionItems = createSuggestionItems([
  {
    title: "文本",
    description: "开始输入普通文本段落",
    searchTerms: ["p", "paragraph", "text"],
    icon: <Text size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode("paragraph", "paragraph")
        .run();
    },
  },
  {
    title: "待办事项",
    description: "创建可勾选的任务列表",
    searchTerms: ["todo", "task", "list", "check", "checkbox"],
    icon: <CheckSquare size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: "一级标题",
    description: "大标题，用于主要章节",
    searchTerms: ["title", "big", "large", "h1"],
    icon: <Heading1 size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 1 })
        .run();
    },
  },
  {
    title: "二级标题",
    description: "中等标题，用于子章节",
    searchTerms: ["subtitle", "medium", "h2"],
    icon: <Heading2 size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 2 })
        .run();
    },
  },
  {
    title: "三级标题",
    description: "小标题，用于细分内容",
    searchTerms: ["subtitle", "small", "h3"],
    icon: <Heading3 size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 3 })
        .run();
    },
  },
  {
    title: "无序列表",
    description: "创建项目符号列表",
    searchTerms: ["unordered", "point", "bullet"],
    icon: <List size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "有序列表",
    description: "创建带编号的列表",
    searchTerms: ["ordered", "number"],
    icon: <ListOrdered size={18} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "引用",
    description: "添加引用块",
    searchTerms: ["blockquote", "quote"],
    icon: <TextQuote size={18} />,
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
    description: "插入代码片段",
    searchTerms: ["codeblock", "code"],
    icon: <Code size={18} />,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
]);

// 配置 slash 命令
export const slashCommand = Command.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems,
  },
});
