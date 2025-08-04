"use client"

import { useState, useCallback, useEffect } from "react"
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
import { Button } from "@/components/ui/button"
import { Eye, Edit, Download } from "lucide-react"

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
  showToolbar?: boolean
  defaultMode?: "edit" | "preview"
}

// 内部编辑器组件，不使用SSR
function AIEditorInternal({
  initialContent,
  placeholder = "开始写作...",
  className = "",
  onContentChange,
  onMarkdownChange,
  showToolbar = true,
  defaultMode = "edit",
}: AIEditorProps) {
  // 编辑器状态
  const [editor, setEditor] = useState<EditorInstance | null>(null)
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [selectedText, setSelectedText] = useState("")
  const [aiSuggestion, setAISuggestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<"edit" | "preview">(defaultMode)
  const [markdown, setMarkdown] = useState("")
  const [content, setContent] = useState<JSONContent | undefined>(initialContent)

  // 防抖更新函数
  const debouncedUpdate = useDebouncedCallback((editor: EditorInstance) => {
    const json = editor.getJSON()
    onContentChange?.(json)
    setContent(json)

    const markdownContent = editor.storage.markdown.getMarkdown()
    setMarkdown(markdownContent)

    if (onMarkdownChange) {
      onMarkdownChange(markdownContent)
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

      // 根据提示词生成不同的响应
      let response = ""
      if (prompt.includes("改进")) {
        response = "这是一个改进后的文本版本，更加清晰和有说服力。"
      } else if (prompt.includes("扩展")) {
        response = "经过优化的内容，增加了更多细节和具体例子。"
      } else if (prompt.includes("总结")) {
        response = "重新组织的段落结构，逻辑更加清晰。"
      } else if (prompt.includes("修正")) {
        response = "修正了语法问题，表达更加准确。"
      } else {
        // 默认响应
        const responses = [
          "这是一个改进后的文本版本，更加清晰和有说服力。",
          "经过优化的内容，增加了更多细节和具体例子。",
          "重新组织的段落结构，逻辑更加清晰。",
          "修正了语法问题，表达更加准确。"
        ]
        response = responses[Math.floor(Math.random() * responses.length)]
      }

      setAISuggestion(response)
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

  // 导出Markdown文件
  const exportMarkdown = useCallback(() => {
    if (!markdown) return

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `document-${new Date().toISOString().split('T')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [markdown])

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
    <div className={`ai-editor-container h-full flex flex-col ${className}`}>
      {/* 工具栏 */}
      {showToolbar && (
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI 编辑器</h2>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant={mode === "edit" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setMode("edit")}
            >
              <Edit className="w-4 h-4 mr-1" /> 编辑
            </Button>
            <Button
              variant={mode === "preview" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setMode("preview")}
            >
              <Eye className="w-4 h-4 mr-1" /> Markdown输出
            </Button>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
            <Button
              variant="ghost"
              size="sm"
              onClick={exportMarkdown}
              disabled={!markdown}
            >
              <Download className="w-4 h-4 mr-1" /> 导出
            </Button>
          </div>
        </div>
      )}

      {/* 编辑器和预览区域 */}
      <div className="flex-1 overflow-hidden">
        {/* 编辑器区域 */}
        {mode === "edit" && (
          <div className="w-full h-full">
            <EditorRoot>
              <EditorContent
                immediatelyRender={false}
                initialContent={content}
                extensions={aiEditorExtensions}
                className="h-full w-full overflow-auto"
                editorProps={{
                  handleDOMEvents: {
                    keydown: (_view, event) => handleCommandNavigation(event),
                  },
                  handlePaste: (view, event) =>
                    handleImagePaste(view, event, uploadFn),
                  handleDrop: (view, event, _slice, moved) =>
                    handleImageDrop(view, event, moved, uploadFn),
                  attributes: {
                    class: "prose prose-base dark:prose-invert max-w-none p-4 focus:outline-none min-h-full",
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
          </div>
        )}

        {/* Markdown输出区域 */}
        {mode === "preview" && (
          <div className="w-full h-full p-4 bg-gray-50 dark:bg-gray-800">
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 h-full flex flex-col">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Markdown 输出</h3>
              <pre className="text-sm whitespace-pre-wrap font-mono text-gray-800 dark:text-gray-200 flex-1 overflow-auto">
                {markdown || '开始编辑以查看Markdown输出...'}
              </pre>
            </div>
          </div>
        )}
      </div>

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
