"use client"

import { useState, useCallback, useEffect } from "react"
import dynamic from "next/dynamic"
import {
  EditorRoot,
  EditorContent,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  type EditorInstance,
  type JSONContent,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
} from "novel"
import { useDebouncedCallback } from "use-debounce"

// 导入我们的扩展和组件
import { aiEditorExtensions, uploadFn } from "./extensions"
import { suggestionItems } from "./slash-command"

interface AIEditorProps {
  initialContent?: JSONContent
  placeholder?: string
  className?: string
  onContentChange?: (content: JSONContent) => void
  onMarkdownChange?: (markdown: string) => void
}

// 内部编辑器组件，不使用SSR
function AIEditorInternal({
  initialContent,
  placeholder = "开始写作...",
  className = "",
  onContentChange,
  onMarkdownChange,
}: AIEditorProps) {
  const [editor, setEditor] = useState<EditorInstance | null>(null)

  // 防抖更新函数
  const debouncedUpdate = useDebouncedCallback((editor: EditorInstance) => {
    const json = editor.getJSON()
    onContentChange?.(json)

    if (onMarkdownChange) {
      const markdown = editor.storage.markdown.getMarkdown()
      onMarkdownChange(markdown)
    }
  }, 300)

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
            setEditor(editor)
          }}
          onUpdate={({ editor }) => {
            debouncedUpdate(editor)
          }}
        >
          {/* Slash 命令菜单 */}
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-gray-500 dark:text-gray-400">
              没有找到结果
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-700"
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
        </EditorContent>
      </EditorRoot>
    </div>
  )
}

// 使用动态导入禁用SSR的主要导出组件
export function AIEditor(props: AIEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className={`ai-editor-container ${props.className || ""}`}>
        <div className="w-full h-full min-h-[400px] flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="text-gray-500 dark:text-gray-400">加载编辑器中...</div>
        </div>
      </div>
    )
  }

  return <AIEditorInternal {...props} />
}
