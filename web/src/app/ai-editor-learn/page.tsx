// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Code, FileText, Download } from "lucide-react";

import { AIEditor } from "~/components/ai-editor";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";

// 初始内容
const initialContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "🤖 AI 编辑器演示" }]
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "欢迎使用全新的 AI 编辑器！这是一个从零开始构建的智能写作工具。" }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "✨ 主要功能" }]
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
                { type: "text", text: "选中文字后自动显示 AI 工具栏" }
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
                { type: "text", text: "快速 AI 提示词：改进、扩展、总结、修正" }
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
                { type: "text", text: "自定义 AI 指令" }
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
                { type: "text", text: "快捷键支持：Ctrl+K 打开 AI 助手" }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "🚀 开始体验" }]
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "试试选中这段文字，然后点击工具栏中的 AI 按钮，或者按 " },
        { type: "text", text: "Ctrl+K", marks: [{ type: "code" }] },
        { type: "text", text: " 快捷键！" }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "✨ 新功能测试" }]
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "输入 " },
        { type: "text", text: "/", marks: [{ type: "code" }] },
        { type: "text", text: " 可以打开 Slash 命令菜单，选择不同的内容类型。" }
      ]
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "你也可以直接拖拽图片到编辑器中进行上传！" }
      ]
    }
  ]
};

export default function AIEditorDemoPage() {
  const [content, setContent] = useState<any>(initialContent);
  const [markdown, setMarkdown] = useState("");

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-editor-content.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/editor-demo">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回编辑器演示
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <h1 className="text-lg font-semibold">AI 编辑器演示</h1>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <Badge variant="outline">
              Novel + TipTap + ProseMirror
            </Badge>
            {markdown && (
              <Button variant="outline" size="sm" onClick={downloadMarkdown}>
                <Download className="h-4 w-4 mr-2" />
                下载 Markdown
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">AI 编辑器</TabsTrigger>
            <TabsTrigger value="output">Markdown 输出</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  <span>AI 智能编辑器</span>
                </CardTitle>
                <CardDescription>
                  选中文字体验 AI 功能，或使用 Ctrl+K 快捷键打开 AI 助手
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AIEditor
                  initialContent={content}
                  onContentChange={setContent}
                  onMarkdownChange={setMarkdown}
                  placeholder="开始写作，选中文字体验 AI 功能..."
                  className="min-h-[500px]"
                />
              </CardContent>
            </Card>
          </TabsContent>      
          <TabsContent value="output" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>Markdown 输出</span>
                </CardTitle>
                <CardDescription>
                  实时查看编辑器生成的 Markdown 内容
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] w-full rounded border p-4">
                  <pre className="text-sm">
                    <code>{markdown || "开始编辑以查看 Markdown 输出..."}</code>
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
