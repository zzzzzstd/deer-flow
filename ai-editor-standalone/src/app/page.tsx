"use client"

import { useState } from 'react'
import { AIEditor } from '@/components/ai-editor'

export default function Home() {
  const [markdown, setMarkdown] = useState<string>('')

  return (
    <main className="container mx-auto p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">AI编辑器演示</h1>
        <p className="text-gray-600 dark:text-gray-400">
          基于 Novel + TipTap + ProseMirror 技术栈的独立AI编辑器组件
        </p>
      </div>

      {/* 编辑器主体 */}
      <div className="h-[600px] border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
        <AIEditor
          initialContent={{
            type: "doc",
            content: [
              {
                type: "heading",
                attrs: { level: 1 },
                content: [{ type: "text", text: "🎉 欢迎使用 AI Editor" }]
              },
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "这是一个功能完整的 AI 编辑器，基于 " },
                  { type: "text", text: "Novel + TipTap + ProseMirror", marks: [{ type: "bold" }] },
                  { type: "text", text: " 技术栈构建。" }
                ]
              },
              {
                type: "heading",
                attrs: { level: 2 },
                content: [{ type: "text", text: "🚀 快速开始" }]
              },
              {
                type: "bulletList",
                content: [
                  {
                    type: "listItem",
                    content: [
                      {
                        type: "paragraph",
                        content: [
                          { type: "text", text: "选中这段文字，然后点击工具栏中的 " },
                          { type: "text", text: "AI", marks: [{ type: "bold" }] },
                          { type: "text", text: " 按钮体验 AI 功能" }
                        ]
                      }
                    ]
                  },
                  {
                    type: "listItem",
                    content: [
                      {
                        type: "paragraph",
                        content: [
                          { type: "text", text: "按 " },
                          { type: "text", text: "Ctrl+K", marks: [{ type: "code" }] },
                          { type: "text", text: " 快捷键打开 AI 助手" }
                        ]
                      }
                    ]
                  },
                  {
                    type: "listItem",
                    content: [
                      {
                        type: "paragraph",
                        content: [
                          { type: "text", text: "输入 " },
                          { type: "text", text: "/", marks: [{ type: "code" }] },
                          { type: "text", text: " 打开 Slash 命令菜单" }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                type: "heading",
                attrs: { level: 2 },
                content: [{ type: "text", text: "✨ 试试这些功能" }]
              },
              {
                type: "taskList",
                content: [
                  {
                    type: "taskItem",
                    attrs: { checked: false },
                    content: [
                      {
                        type: "paragraph",
                        content: [{ type: "text", text: "拖拽图片到编辑器中" }]
                      }
                    ]
                  },
                  {
                    type: "taskItem",
                    attrs: { checked: false },
                    content: [
                      {
                        type: "paragraph",
                        content: [{ type: "text", text: "使用 AI 功能改进文字" }]
                      }
                    ]
                  },
                  {
                    type: "taskItem",
                    attrs: { checked: true },
                    content: [
                      {
                        type: "paragraph",
                        content: [{ type: "text", text: "体验 Slash 命令" }]
                      }
                    ]
                  }
                ]
              }
            ]
          }}
          placeholder="开始写作，体验AI功能..."
          onMarkdownChange={setMarkdown}
          showToolbar={true}
          defaultMode="edit"
          className="h-full"
          aiConfig={{
            baseUrl: process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://localhost:8000',
            timeout: 30000,
          }}
        />
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
