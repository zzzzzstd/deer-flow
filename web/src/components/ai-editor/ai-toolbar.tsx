// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

"use client";

import { useState, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Sparkles,
  Loader2,
} from "lucide-react";
import { EditorBubble, EditorBubbleItem, type EditorInstance } from "novel";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

interface AIToolbarProps {
  editor: EditorInstance | null;
  onAIClick: () => void;
  isLoading: boolean;
}

export function AIToolbar({ editor, onAIClick, isLoading }: AIToolbarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const updateVisibility = () => {
      const { selection } = editor.state;
      const hasSelection = !selection.empty;
      setIsVisible(hasSelection);
    };

    // 监听选择变化
    editor.on("selectionUpdate", updateVisibility);
    editor.on("transaction", updateVisibility);

    return () => {
      editor.off("selectionUpdate", updateVisibility);
      editor.off("transaction", updateVisibility);
    };
  }, [editor]);

  if (!editor || !isVisible) return null;

  return (
    <EditorBubble
      tippyOptions={{
        placement: "top",
        duration: 100,
      }}
      className="ai-toolbar-bubble"
    >
      <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
        {/* 核心文本格式化按钮 */}
        <EditorBubbleItem
          onSelect={(editor) => {
            editor.chain().focus().toggleBold().run();
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-none ${editor.isActive("bold") ? "bg-gray-100 dark:bg-gray-700" : ""}`}
          >
            <Bold className="h-4 w-4" />
          </Button>
        </EditorBubbleItem>

        <EditorBubbleItem
          onSelect={(editor) => {
            editor.chain().focus().toggleItalic().run();
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-none ${editor.isActive("italic") ? "bg-gray-100 dark:bg-gray-700" : ""}`}
          >
            <Italic className="h-4 w-4" />
          </Button>
        </EditorBubbleItem>

        <EditorBubbleItem
          onSelect={(editor) => {
            editor.chain().focus().toggleUnderline().run();
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-none ${editor.isActive("underline") ? "bg-gray-100 dark:bg-gray-700" : ""}`}
          >
            <Underline className="h-4 w-4" />
          </Button>
        </EditorBubbleItem>

        <EditorBubbleItem
          onSelect={(editor) => {
            editor.chain().focus().toggleStrike().run();
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-none ${editor.isActive("strike") ? "bg-gray-100 dark:bg-gray-700" : ""}`}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
        </EditorBubbleItem>

        <Separator orientation="vertical" className="h-6" />

        <EditorBubbleItem
          onSelect={(editor) => {
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-none ${editor.isActive("heading", { level: 1 }) ? "bg-gray-100 dark:bg-gray-700" : ""}`}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
        </EditorBubbleItem>

        <EditorBubbleItem
          onSelect={(editor) => {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-none ${editor.isActive("heading", { level: 2 }) ? "bg-gray-100 dark:bg-gray-700" : ""}`}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
        </EditorBubbleItem>

        <Separator orientation="vertical" className="h-6" />

        {/* AI 按钮 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onAIClick}
          disabled={isLoading}
          className="rounded-none text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          <span className="ml-1 text-xs">AI</span>
        </Button>
      </div>
    </EditorBubble>
  );
}
