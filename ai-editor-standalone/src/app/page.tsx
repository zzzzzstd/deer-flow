"use client"

import { useState } from 'react'
import { AIEditor } from '@/components/ai-editor'
import { Button } from "@/components/ui/button"
import { Eye, Edit, Code } from "lucide-react"

export default function Home() {
  const [markdown, setMarkdown] = useState<string>('')
  const [mode, setMode] = useState<"edit" | "preview" | "split">("edit")

  return (
    <main className="container mx-auto p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">AI编辑器演示</h1>
        <p className="text-gray-600 dark:text-gray-400">
          基于 Novel + TipTap + ProseMirror 技术栈的独立AI编辑器组件
        </p>
      </div>

      {/* 编辑器主体 */}
      <div className="h-[600px] flex flex-col border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
        {/* 工具栏 */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold">编辑器</h2>
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
              <Eye className="w-4 h-4 mr-1" /> 预览
            </Button>
            <Button
              variant={mode === "split" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setMode("split")}
            >
              <Code className="w-4 h-4 mr-1" /> 分割
            </Button>
          </div>
        </div>

        {/* 编辑器和预览区域 */}
        <div className="flex-1 flex">
          {(mode === "edit" || mode === "split") && (
            <div className={`${mode === "split" ? "w-1/2" : "w-full"} flex flex-col`}>
              <AIEditor
                placeholder="开始写作..."
                onMarkdownChange={setMarkdown}
                className="flex-1 border-none"
              />
            </div>
          )}
          {(mode === "preview" || mode === "split") && (
            <div className={`${mode === "split" ? "w-1/2 border-l" : "w-full"} p-4 overflow-auto bg-gray-50 dark:bg-gray-800`}>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <pre className="text-sm whitespace-pre-wrap bg-white dark:bg-gray-900 p-4 rounded border">
                  {markdown || '开始编辑以查看Markdown输出...'}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 使用说明 */}
      <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
        <h2 className="text-xl font-bold mb-4 text-blue-800 dark:text-blue-200">💡 快速上手</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <span className="text-blue-600 dark:text-blue-400">1️⃣</span>
            <div>
              <strong>选中文字</strong>：选中任意文字，工具栏会自动出现，点击 AI 按钮体验智能功能
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-600 dark:text-blue-400">2️⃣</span>
            <div>
              <strong>快捷键</strong>：按 <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">Ctrl+K</code> 打开 AI 助手，输入 <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">/</code> 打开命令菜单
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-600 dark:text-blue-400">3️⃣</span>
            <div>
              <strong>AI 功能</strong>：改进文字、扩展内容、总结要点、修正语法等智能写作助手功能
            </div>
          </div>
        </div>
      </div>

      {/* 功能说明 */}
      <div className="mt-8 space-y-6">
        <h2 className="text-2xl font-bold">功能特性</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">📝 富文本编辑</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              支持标题、列表、引用、代码块等丰富的文本格式
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">⚡ Slash 命令</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              输入 "/" 快速插入不同类型的内容块
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">🖼️ 图片支持</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              支持拖拽和粘贴图片上传
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">✅ 任务列表</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              创建可交互的待办事项列表
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">📄 Markdown 导出</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              实时转换为标准 Markdown 格式
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">🤖 AI 智能助手</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              选中文字使用AI工具栏，按Ctrl+K打开AI助手
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h3 className="font-semibold mb-2">🎨 多视图模式</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              支持编辑、预览和分割视图模式切换
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
