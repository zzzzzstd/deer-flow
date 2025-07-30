// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

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
} from "novel";
import { Markdown } from "tiptap-markdown";
import { Extension } from "@tiptap/react";
import { slashCommand } from "./slash-command";
import { uploadFn } from "./image-upload";

// 自定义 AI 命令扩展
const AICommandExtension = Extension.create({
  name: "aiCommand",

  addKeyboardShortcuts() {
    return {
      // Ctrl/Cmd + K 触发 AI 助手
      "Mod-k": () => {
        // 触发 AI 助手的逻辑将在组件中处理
        const event = new CustomEvent("ai-assistant-trigger");
        document.dispatchEvent(event);
        return true;
      },
      // Ctrl/Cmd + Shift + A 快速 AI 生成
      "Mod-Shift-a": () => {
        const event = new CustomEvent("ai-quick-generate");
        document.dispatchEvent(event);
        return true;
      },
    };
  },

  addCommands() {
    return {
      // 添加 AI 高亮命令
      setAIHighlight:
        () =>
        ({ commands }) => {
          return commands.setHighlight({ color: "#3b82f6" });
        },
      // 移除 AI 高亮命令
      unsetAIHighlight:
        () =>
        ({ commands }) => {
          return commands.unsetHighlight();
        },
    };
  },
});

// 配置任务列表
const taskList = TaskList.configure({
  HTMLAttributes: {
    class: "ai-editor-task-list",
  },
});

const taskItem = TaskItem.configure({
  HTMLAttributes: {
    class: "ai-editor-task-item",
  },
  nested: true,
});

// 配置图片扩展
const tiptapImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [
      UploadImagesPlugin({
        imageClass: "ai-editor-image-uploading opacity-40 rounded-lg border border-gray-200",
      }),
    ];
  },
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: "ai-editor-image rounded-lg border border-gray-200 max-w-full h-auto",
  },
});

// 配置拖拽处理
const globalDragHandle = GlobalDragHandle.configure({
  dragHandleWidth: 20,
});

// 配置基础扩展
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
});

// 配置占位符
const placeholder = Placeholder.configure({
  placeholder: ({ node }) => {
    if (node.type.name === "heading") {
      return "输入标题...";
    }
    return "开始写作，输入 '/' 查看 AI 命令...";
  },
});

// 配置链接
const link = TiptapLink.configure({
  HTMLAttributes: {
    class: "ai-editor-link",
  },
  openOnClick: false,
});

// 配置高亮
const highlight = HighlightExtension.configure({
  multicolor: true,
});

// 配置 Markdown 支持
const markdown = Markdown.configure({
  html: true,
  tightLists: true,
  bulletListMarker: "-",
  linkify: false,
  breaks: false,
});

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
  AICommandExtension,
  slashCommand,
  taskList,
  taskItem,
  tiptapImage,
  globalDragHandle,
];

// 导出扩展名称，方便在组件中使用
export const EXTENSION_NAMES = {
  AI_COMMAND: "aiCommand",
  SLASH_COMMAND: "slashCommand",
  HIGHLIGHT: "highlight",
  MARKDOWN: "markdown",
  TASK_LIST: "taskList",
  TASK_ITEM: "taskItem",
  IMAGE: "image",
  DRAG_HANDLE: "globalDragHandle",
} as const;

// 导出图片上传函数
export { uploadFn } from "./image-upload";
