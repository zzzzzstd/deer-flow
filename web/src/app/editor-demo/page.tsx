// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowLeft, Download, Eye, Code, FileText, Sparkles } from "lucide-react";

import ReportEditor from "~/components/editor";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";
import { LearningGuide } from "./components/learning-guide";
import { ArchitectureAnalysis } from "./components/architecture-analysis";
import { LearningSummary } from "./components/learning-summary";

// 示例文档内容
const defaultContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "🦌 DeerFlow 编辑器学习文档" }]
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "欢迎来到 DeerFlow 编辑器学习页面！这是一个功能强大的报告编辑器，支持：" }
      ]
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
                { type: "text", text: "🎯 " },
                { type: "text", text: "拖拽段落和图片", marks: [{ type: "bold" }] }
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
                { type: "text", text: "🤖 " },
                { type: "text", text: "AI 智能编辑", marks: [{ type: "bold" }] }
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
                { type: "text", text: "⚡ " },
                { type: "text", text: "Slash 命令快速插入", marks: [{ type: "bold" }] }
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
                { type: "text", text: "📝 " },
                { type: "text", text: "Markdown 双向转换", marks: [{ type: "bold" }] }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "🚀 快速开始" }]
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "试试以下功能：" }
      ]
    },
    {
      type: "orderedList",
      content: [
        {
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [
                { type: "text", text: "输入 " },
                { type: "text", text: "/", marks: [{ type: "code" }] },
                { type: "text", text: " 查看 Slash 命令菜单" }
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
                { type: "text", text: "鼠标悬停在段落左侧查看拖拽手柄" }
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
                { type: "text", text: "选中文本后点击 " },
                { type: "text", text: "Ask AI", marks: [{ type: "bold" }] },
                { type: "text", text: " 按钮" }
              ]
            }
          ]
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "💡 技术特性" }]
    },
    {
      type: "blockquote",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "这个编辑器基于 " },
            { type: "text", text: "Novel + TipTap + ProseMirror", marks: [{ type: "bold" }] },
            { type: "text", text: " 技术栈，提供了现代化的富文本编辑体验。" }
          ]
        }
      ]
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "现在开始编辑这个文档，体验强大的编辑功能吧！" }
      ]
    }
  ]
};

export default function EditorDemoPage() {
  const [markdown, setMarkdown] = useState("");

  const handleMarkdownChange = (newMarkdown: string) => {
    setMarkdown(newMarkdown);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "editor-demo.md";
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
              <Link href="/chat">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回聊天
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <h1 className="text-lg font-semibold">编辑器学习演示</h1>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <Badge variant="secondary">Novel v1.0.2</Badge>
            <Badge variant="outline">TipTap v2.11.7</Badge>
            <Button variant="outline" size="sm" asChild>
              <Link href="/ai-editor-demo">
                <Sparkles className="h-4 w-4 mr-2" />
                AI 编辑器
              </Link>
            </Button>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="editor">编辑器演示</TabsTrigger>
            <TabsTrigger value="architecture">架构解析</TabsTrigger>
            <TabsTrigger value="guide">学习指南</TabsTrigger>
            <TabsTrigger value="summary">学习总结</TabsTrigger>
            <TabsTrigger value="output">实时输出</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>编辑器预览</span>
                </CardTitle>
                <CardDescription>
                  在下方编辑器中体验拖拽、AI 和 Slash 命令等功能
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 min-h-[600px]">
                  <ReportEditor
                    content={defaultContent}
                    onMarkdownChange={handleMarkdownChange}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="architecture" className="mt-6">
            <ArchitectureAnalysis />
          </TabsContent>

          <TabsContent value="guide" className="mt-6">
            <LearningGuide />
          </TabsContent>

          <TabsContent value="summary" className="mt-6">
            <LearningSummary />
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
                <ScrollArea className="h-[600px] w-full rounded border p-4">
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
