// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

"use client";

import { useState, useCallback } from "react";
import {
  EditorRoot,
  EditorContent,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  ImageResizer,
  type EditorInstance,
  type JSONContent,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
} from "novel";
import { useDebouncedCallback } from "use-debounce";

// 导入我们的扩展和组件
import { aiEditorExtensions, uploadFn } from "./extensions";
import { AIToolbar } from "./ai-toolbar";
import { AIAssistant } from "./ai-assistant";
import { suggestionItems } from "./slash-command";
import "./ai-editor.css";


export interface AIEditorProps {
  initialContent?: any;
  onContentChange?: (content: JSONContent) => void;
  onMarkdownChange?: (markdown: string) => void;
  placeholder?: string;
  className?: string;
}

export function AIEditor({
  initialContent,
  onContentChange,
  onMarkdownChange,
  placeholder = "开始写作，选中文字体验 AI 功能...",
  className = "",
}: AIEditorProps) {
  // 编辑器状态
  const [editor, setEditor] = useState<EditorInstance | null>(null);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [aiSuggestion, setAISuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 防抖更新函数
  const debouncedUpdate = useDebouncedCallback(
    (editor: EditorInstance) => {
      // 获取 JSON 内容
      const jsonContent = editor.getJSON();
      onContentChange?.(jsonContent);

      // 获取 Markdown 内容
      if (onMarkdownChange && editor.storage.markdown) {
        const markdown = editor.storage.markdown.getMarkdown();
        onMarkdownChange(markdown);
      }
    },
    300
  );

  // AI 文本生成函数
  const generateAIText = useCallback(async (prompt: string, context?: string) => {
    setIsLoading(true);
    try {
      // 模拟 AI API 调用
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 模拟 AI 响应
      const responses = [
        "这是一个很有趣的想法。让我们深入探讨一下这个概念的各个方面。",
        "基于你的描述，我建议从以下几个角度来分析这个问题：",
        "这个主题确实值得深入研究。我们可以从历史背景开始，然后分析现状。",
        "你提到的观点很有见地。让我为你扩展一些相关的思考。",
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)] || "AI 响应生成中...";
      setAISuggestion(randomResponse);

    } catch (error) {
      console.error("AI 生成失败:", error);
      setAISuggestion("抱歉，AI 生成失败，请稍后重试。");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 处理文本选择
  const handleTextSelection = useCallback(() => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    if (from === to) {
      setSelectedText("");
      return;
    }

    const text = editor.state.doc.textBetween(from, to);
    setSelectedText(text);
  }, [editor]);

  // 处理 AI 按钮点击
  const handleAIClick = useCallback(() => {
    setIsAIOpen(true);
  }, []);

  // 插入 AI 生成的文本
  const insertAIText = useCallback((text: string) => {
    if (!editor) return;

    editor.chain().focus().insertContent(text).run();
    setAISuggestion("");
    setIsAIOpen(false);
  }, [editor]);

  // 替换选中的文本
  const replaceSelectedText = useCallback((text: string) => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    editor.chain().focus().deleteRange({ from, to }).insertContent(text).run();
    setAISuggestion("");
    setIsAIOpen(false);
  }, [editor]);

  return (
    <div className={`ai-editor-container ${className}`}>
      <EditorRoot>
        <EditorContent
          immediatelyRender={false}
          initialContent={initialContent}
          extensions={aiEditorExtensions}
          className="w-full h-full"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) =>
              handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class: "prose prose-base dark:prose-invert max-w-none p-4 focus:outline-none min-h-[400px]",
              "data-placeholder": placeholder,
            },
          }}
          onCreate={({ editor }) => {
            setEditor(editor);
          }}
          onUpdate={({ editor }) => {
            debouncedUpdate(editor);
          }}
          onSelectionUpdate={handleTextSelection}
          slotAfter={<ImageResizer />}
        >
          {/* Slash 命令菜单 */}
          <EditorCommand className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-50 h-auto max-h-[330px] overflow-y-auto rounded-md px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="text-gray-500 dark:text-gray-400 px-2">
              没有找到相关命令
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          {/* AI 工具栏 */}
          <AIToolbar
            editor={editor}
            onAIClick={handleAIClick}
            isLoading={isLoading}
          />
        </EditorContent>
      </EditorRoot>

      {/* AI 助手面板 */}
      {isAIOpen && (
        <AIAssistant
          selectedText={selectedText}
          suggestion={aiSuggestion}
          isLoading={isLoading}
          onGenerate={generateAIText}
          onInsert={insertAIText}
          onReplace={replaceSelectedText}
          onClose={() => setIsAIOpen(false)}
        />
      )}
    </div>
  );
}

export default AIEditor;
