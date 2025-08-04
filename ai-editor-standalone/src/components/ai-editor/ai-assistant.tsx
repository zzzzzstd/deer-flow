"use client"

import { useState } from "react"
import { 
  X, 
  Sparkles, 
  RefreshCw, 
  Check, 
  Copy,
  Loader2,
  Wand2,
  Edit3,
  Plus,
} from "lucide-react"

interface AIAssistantProps {
  selectedText: string
  suggestion: string
  isLoading: boolean
  onGenerate: (prompt: string, context?: string) => Promise<void>
  onInsert: (text: string) => void
  onReplace: (text: string) => void
  onClose: () => void
}

const AI_PROMPTS = [
  { label: "改进文字", prompt: "请帮我改进这段文字，让它更清晰、更有说服力", icon: <Edit3 className="h-4 w-4" /> },
  { label: "扩展内容", prompt: "请帮我扩展这段内容，添加更多细节和例子", icon: <Plus className="h-4 w-4" /> },
  { label: "总结要点", prompt: "请帮我总结这段文字的核心要点", icon: <Wand2 className="h-4 w-4" /> },
  { label: "修正语法", prompt: "请帮我检查并修正这段文字的语法和表达", icon: <Check className="h-4 w-4" /> },
]

export function AIAssistant({
  selectedText,
  suggestion,
  isLoading,
  onGenerate,
  onInsert,
  onReplace,
  onClose,
}: AIAssistantProps) {
  const [customPrompt, setCustomPrompt] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)

  const handleQuickPrompt = async (prompt: string) => {
    if (selectedText) {
      await onGenerate(`${prompt}：${selectedText}`)
    }
  }

  const handleCustomPrompt = async () => {
    if (customPrompt.trim()) {
      const fullPrompt = selectedText 
        ? `${customPrompt}：${selectedText}`
        : customPrompt
      await onGenerate(fullPrompt)
      setCustomPrompt("")
      setShowCustomInput(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.error("复制失败:", error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[80vh] overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-4">
          <div>
            <h3 className="flex items-center space-x-2 text-lg font-semibold">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <span>AI 写作助手</span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {selectedText ? "为选中的文字提供 AI 建议" : "使用 AI 生成内容"}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {/* 选中的文字 */}
          {selectedText && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">选中的文字</span>
                <button
                  onClick={() => copyToClipboard(selectedText)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {selectedText}
              </p>
            </div>
          )}

          {/* 快速提示词 */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">快速操作</h4>
            <div className="grid grid-cols-2 gap-2">
              {AI_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt.prompt)}
                  disabled={isLoading || !selectedText}
                  className="flex items-center justify-start p-2 text-sm border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {prompt.icon}
                  <span className="ml-2">{prompt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 自定义提示词 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">自定义指令</h4>
              <button
                onClick={() => setShowCustomInput(!showCustomInput)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {showCustomInput ? "收起" : "展开"}
              </button>
            </div>
            
            {showCustomInput && (
              <div className="space-y-2">
                <textarea
                  placeholder="输入你的自定义指令..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full min-h-[80px] p-2 border border-gray-200 dark:border-gray-700 rounded resize-none bg-white dark:bg-gray-800 text-sm"
                />
                <button
                  onClick={handleCustomPrompt}
                  disabled={isLoading || !customPrompt.trim()}
                  className="w-full flex items-center justify-center p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  生成内容
                </button>
              </div>
            )}
          </div>

          {/* AI 建议 */}
          {(suggestion || isLoading) && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium flex items-center">
                  <Sparkles className="h-4 w-4 mr-1 text-blue-500" />
                  AI 建议
                </h4>
                {suggestion && (
                  <button
                    onClick={() => copyToClipboard(suggestion)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                )}
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                {isLoading ? (
                  <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">AI 正在思考中...</span>
                  </div>
                ) : (
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {suggestion}
                  </p>
                )}
              </div>

              {suggestion && !isLoading && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => selectedText ? onReplace(suggestion) : onInsert(suggestion)}
                    className="flex-1 flex items-center justify-center p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {selectedText ? "替换文字" : "插入内容"}
                  </button>
                  
                  {!selectedText && (
                    <button
                      onClick={() => onInsert(suggestion)}
                      className="flex-1 flex items-center justify-center p-2 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      插入内容
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleQuickPrompt("请重新生成一个不同的版本")}
                    className="p-2 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
