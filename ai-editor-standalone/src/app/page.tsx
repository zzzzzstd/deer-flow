"use client"

import { useState } from 'react'
import { AIEditor } from '@/components/ai-editor'
import type { JSONContent } from 'novel'

export default function Home() {
  const [content, setContent] = useState<JSONContent>()
  const [markdown, setMarkdown] = useState<string>('')

  return (
    <main className="container mx-auto p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">AI编辑器演示</h1>
        <p className="text-gray-600 dark:text-gray-400">
          基于 Novel + TipTap + ProseMirror 技术栈的独立AI编辑器组件
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 编辑器 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">编辑器</h2>
          <AIEditor
            placeholder="开始写作..."
            onContentChange={setContent}
            onMarkdownChange={setMarkdown}
            className="min-h-[500px]"
          />
        </div>

        {/* 输出预览 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Markdown 输出</h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg min-h-[500px] overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">{markdown || '开始编辑以查看Markdown输出...'}</pre>
          </div>
        </div>
      </div>

      {/* 功能说明 */}
      <div className="mt-12 space-y-6">
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
            <h3 className="font-semibold mb-2">🎨 可定制</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              完全独立，易于集成到任何项目中
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
