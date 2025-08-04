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
  ImageResizer,
  type EditorInstance,
  type JSONContent,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
} from "novel"
import { useDebouncedCallback } from "use-debounce"

// 导入我们的扩展和组件
import { aiEditorExtensions, uploadFn } from "./extensions"
import { AIToolbar } from "./ai-toolbar"
import { AIAssistant } from "./ai-assistant"
import { suggestionItems } from "./slash-command"
import "./ai-editor.css"

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
  // 编辑器状态
  const [editor, setEditor] = useState<EditorInstance | null>(null)
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [selectedText, setSelectedText] = useState("")
  const [aiSuggestion, setAISuggestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // 防抖更新函数
  const debouncedUpdate = useDebouncedCallback((editor: EditorInstance) => {
    const json = editor.getJSON()
    onContentChange?.(json)

    if (onMarkdownChange) {
      const markdown = editor.storage.markdown.getMarkdown()
      onMarkdownChange(markdown)
    }
  }, 300)

  // AI 功能处理函数
  const handleAIClick = useCallback(() => {
    if (!editor) return

    const { selection } = editor.state
    const selectedText = editor.state.doc.textBetween(selection.from, selection.to)

    setSelectedText(selectedText)
    setIsAIOpen(true)
  }, [editor])

  // 模拟 AI 生成文本
  const generateAIText = useCallback(async (prompt: string) => {
    setIsLoading(true)
    setAISuggestion("")

    try {
      // 模拟 API 调用延迟
      await new Promise(resolve => setTimeout(resolve, 1500))

      // 模拟 AI 响应
      const responses = [
        "这是一个改进后的文本版本，更加清晰和有说服力。",
        "经过优化的内容，增加了更多细节和具体例子。",
        "重新组织的段落结构，逻辑更加清晰。",
        "修正了语法问题，表达更加准确。"
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setAISuggestion(randomResponse)
    } catch (error) {
      console.error("AI 生成失败:", error)
      setAISuggestion("抱歉，AI 生成失败，请稍后重试。")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // 插入 AI 生成的文本
  const insertAIText = useCallback((text: string) => {
    if (!editor) return

    editor.chain().focus().insertContent(text).run()
    setIsAIOpen(false)
    setAISuggestion("")
  }, [editor])

  // 替换选中的文本
  const replaceSelectedText = useCallback((text: string) => {
    if (!editor) return

    const { selection } = editor.state
    editor.chain().focus().deleteRange({ from: selection.from, to: selection.to }).insertContent(text).run()
    setIsAIOpen(false)
    setAISuggestion("")
  }, [editor])

  // 监听键盘快捷键
  useEffect(() => {
    const handleKeyboardShortcuts = (event: CustomEvent) => {
      if (event.type === "ai-assistant-trigger") {
        handleAIClick()
      }
    }

    document.addEventListener("ai-assistant-trigger", handleKeyboardShortcuts as EventListener)
    document.addEventListener("ai-quick-generate", handleKeyboardShortcuts as EventListener)

    return () => {
      document.removeEventListener("ai-assistant-trigger", handleKeyboardShortcuts as EventListener)
      document.removeEventListener("ai-quick-generate", handleKeyboardShortcuts as EventListener)
    }
  }, [handleAIClick])

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

          {/* AI 工具栏 */}
          <AIToolbar
            editor={editor}
            onAIClick={handleAIClick}
            isLoading={isLoading}
          />

          {/* 图片调整器 */}
          <ImageResizer />
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
