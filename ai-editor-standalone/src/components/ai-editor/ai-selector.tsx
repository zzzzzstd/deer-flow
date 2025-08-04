"use client"

import { useState, useCallback } from "react"
import { ArrowUp, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAI } from "@/hooks/use-ai"
import { AI_COMMANDS, type AICommandOption } from "@/lib/ai-commands"
import { type EditorInstance } from "novel"
import Markdown from "react-markdown"

interface AISelectorProps {
  editor: EditorInstance | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface AICompletionCommandsProps {
  completion: string
  onDiscard: () => void
  onReplace: () => void
  onInsert: () => void
}

function AICompletionCommands({ 
  completion, 
  onDiscard, 
  onReplace, 
  onInsert 
}: AICompletionCommandsProps) {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-2">
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={onReplace}
          className="flex-1"
        >
          替换选中内容
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onInsert}
          className="flex-1"
        >
          插入到下方
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDiscard}
        >
          丢弃
        </Button>
      </div>
    </div>
  )
}

interface AISelectorCommandsProps {
  onSelect: (command: AICommandOption, selectedText: string) => void
  selectedText: string
  hasSelection: boolean
}

function AISelectorCommands({ onSelect, selectedText, hasSelection }: AISelectorCommandsProps) {
  // 编辑类命令（只在有选中文字时显示）
  const editCommands = AI_COMMANDS.filter(cmd =>
    (cmd.category === 'edit' || cmd.category === 'improve') && cmd.requiresSelection
  )
  // 生成类命令
  const generateCommands = AI_COMMANDS.filter(cmd => cmd.category === 'generate')

  return (
    <div className="max-h-[300px] overflow-y-auto">
      {hasSelection && editCommands.length > 0 && (
        <>
          <div className="px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            编辑或审查选中内容
          </div>
          <div className="py-1">
            {editCommands.map((command) => (
              <button
                key={command.id}
                onClick={() => onSelect(command, selectedText)}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <command.icon className="h-4 w-4 text-purple-500 shrink-0" />
                <span>{command.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      <div className="px-2 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
        使用AI做更多
      </div>
      <div className="py-1">
        {generateCommands.map((command) => (
          <button
            key={command.id}
            onClick={() => onSelect(command, selectedText)}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <command.icon className="h-4 w-4 text-purple-500 shrink-0" />
            <span>{command.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function AISelector({ editor, open, onOpenChange }: AISelectorProps) {
  const [inputValue, setInputValue] = useState("")
  const [showInput, setShowInput] = useState(false) // 控制是否显示输入框
  const { completion, isLoading, executeCommand, reset } = useAI()

  const hasCompletion = completion.length > 0

  // 获取选中的文本
  const getSelectedText = useCallback(() => {
    if (!editor) return ""
    const { selection } = editor.state
    return editor.state.doc.textBetween(selection.from, selection.to)
  }, [editor])

  const selectedText = getSelectedText()
  const hasSelection = selectedText.length > 0

  // 处理命令选择
  const handleCommandSelect = useCallback(async (command: AICommandOption, text: string) => {
    if (!editor) return

    try {
      setShowInput(false) // 隐藏命令列表，显示加载状态
      await executeCommand(command, text)
    } catch (error) {
      console.error("AI命令执行失败:", error)
    }
  }, [editor, executeCommand])

  // 处理自定义输入
  const handleCustomInput = useCallback(async () => {
    if (!inputValue.trim() || !editor) return

    try {
      if (hasCompletion) {
        // 如果已有完成内容，执行后续命令
        await executeCommand(
          {
            id: 'custom-follow-up',
            type: 'custom',
            label: '后续命令',
            description: '基于已有内容的后续命令',
            icon: ArrowUp,
            prompt: inputValue,
            requiresSelection: false,
            category: 'generate',
          },
          completion,
          inputValue
        )
      } else {
        // 执行新的自定义命令
        await executeCommand(
          {
            id: 'custom',
            type: 'custom',
            label: '自定义命令',
            description: '自定义AI命令',
            icon: ArrowUp,
            prompt: inputValue,
            requiresSelection: false,
            category: 'generate',
          },
          selectedText,
          inputValue
        )
      }
      setInputValue("")
    } catch (error) {
      console.error("自定义命令执行失败:", error)
    }
  }, [inputValue, editor, hasCompletion, completion, selectedText, executeCommand])

  // 处理操作
  const handleReplace = useCallback(() => {
    if (!editor || !completion) return
    const { selection } = editor.state
    editor.chain().focus().deleteRange({ from: selection.from, to: selection.to }).insertContent(completion).run()
    onOpenChange(false)
    reset()
  }, [editor, completion, onOpenChange, reset])

  const handleInsert = useCallback(() => {
    if (!editor || !completion) return
    const { selection } = editor.state
    editor.chain().focus().insertContentAt(selection.to + 1, completion).run()
    onOpenChange(false)
    reset()
  }, [editor, completion, onOpenChange, reset])

  const handleDiscard = useCallback(() => {
    reset()
    setShowInput(false)
    onOpenChange(false)
  }, [reset, onOpenChange])

  // 重置状态当选择器关闭时
  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setShowInput(false)
      setInputValue("")
      reset()
    }
    onOpenChange(open)
  }, [onOpenChange, reset])

  if (!editor || !open) return null

  return (
    <div className="w-[350px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
      {/* 显示AI完成内容 */}
      {hasCompletion && (
        <div className="max-h-[300px] overflow-y-auto p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-sm">
              <Markdown>{completion}</Markdown>
            </div>
          </div>
        </div>
      )}

      {/* 加载状态 */}
      {isLoading && (
        <div className="flex items-center px-4 py-3 text-sm font-medium text-purple-500">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          AI正在思考中...
        </div>
      )}

      {/* 主要内容区域 */}
      {!isLoading && (
        <>
          {/* 自定义输入框（仅在需要时显示） */}
          {(showInput || hasCompletion) && (
            <div className="relative p-3 border-b border-gray-200 dark:border-gray-700">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleCustomInput()
                  }
                }}
                placeholder={
                  hasCompletion
                    ? "告诉AI接下来要做什么"
                    : "让AI编辑或生成内容..."
                }
                className="w-full pr-10 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded focus:outline-hidden focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                autoFocus
              />
              <Button
                size="sm"
                onClick={handleCustomInput}
                disabled={!inputValue.trim()}
                className="absolute right-5 top-1/2 -translate-y-1/2 h-6 w-6 p-0 rounded-full bg-purple-500 hover:bg-purple-600"
              >
                <ArrowUp className="h-3 w-3" />
              </Button>
            </div>
          )}

          {/* 命令选项或完成操作 */}
          {hasCompletion ? (
            <AICompletionCommands
              completion={completion}
              onDiscard={handleDiscard}
              onReplace={handleReplace}
              onInsert={handleInsert}
            />
          ) : showInput ? (
            // 显示返回按钮
            <div className="p-2">
              <button
                onClick={() => setShowInput(false)}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                ← 返回命令列表
              </button>
            </div>
          ) : (
            // 显示命令列表和自定义输入选项
            <>
              <AISelectorCommands
                onSelect={handleCommandSelect}
                selectedText={selectedText}
                hasSelection={hasSelection}
              />
              <div className="border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowInput(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <ArrowUp className="h-4 w-4 text-purple-500 shrink-0" />
                  <span>自定义指令...</span>
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
