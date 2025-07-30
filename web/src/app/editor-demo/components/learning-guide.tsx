// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Code, Lightbulb, Zap } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

interface LearningSection {
  id: string;
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  content: {
    overview: string;
    keyPoints: string[];
    codeExample?: string;
    tips?: string[];
  };
}

const learningSections: LearningSection[] = [
  {
    id: "architecture",
    title: "🏗️ 编辑器架构",
    description: "理解 Novel + TipTap + ProseMirror 的技术栈组合",
    level: "beginner",
    content: {
      overview: "DeerFlow 编辑器采用了三层架构设计，每一层都有其特定的职责和优势。",
      keyPoints: [
        "Novel: 提供 React 组件封装和 AI 集成",
        "TipTap: 提供扩展系统和命令链式调用",
        "ProseMirror: 提供底层文档模型和状态管理",
        "数据流: 用户操作 → TipTap命令 → ProseMirror状态 → React重渲染"
      ],
      codeExample: `// 编辑器组件结构
<EditorRoot>
  <EditorContent
    extensions={extensions}
    editorProps={{
      handleDrop: handleImageDrop,
      handlePaste: handleImagePaste,
    }}
  >
    <EditorCommand>        // Slash命令
    <GenerativeMenuSwitch> // AI功能
  </EditorContent>
</EditorRoot>`,
      tips: [
        "先理解 ProseMirror 的文档模型概念",
        "学习 TipTap 的扩展系统如何工作",
        "了解 Novel 如何简化 React 集成"
      ]
    }
  },
  {
    id: "drag-drop",
    title: "🎯 拖拽功能实现",
    description: "深入学习 GlobalDragHandle 扩展的工作原理",
    level: "intermediate",
    content: {
      overview: "拖拽功能通过 GlobalDragHandle 扩展实现，它为每个块级元素添加了拖拽手柄。",
      keyPoints: [
        "GlobalDragHandle 扩展自动为块级元素添加拖拽手柄",
        "CSS 控制拖拽手柄的显示和交互效果",
        "支持段落、图片、列表等所有块级元素的拖拽",
        "拖拽时会改变光标样式提供视觉反馈"
      ],
      codeExample: `// 扩展配置
const globalDragHandle = GlobalDragHandle.configure({});

// CSS 样式
.drag-handle {
  position: fixed;
  cursor: grab;
  z-index: 50;
  
  &:active {
    cursor: grabbing;
  }
}`,
      tips: [
        "拖拽手柄只在鼠标悬停时显示",
        "移动端会自动隐藏拖拽功能",
        "可以通过 CSS 自定义拖拽手柄的样式"
      ]
    }
  },
  {
    id: "ai-integration",
    title: "🤖 AI 集成机制",
    description: "学习 AI 选择器和流式响应处理",
    level: "advanced",
    content: {
      overview: "AI 功能通过流式响应和文本高亮提供智能编辑体验。",
      keyPoints: [
        "流式响应: 实时显示 AI 生成的内容",
        "文本高亮: 选中文本时自动高亮显示",
        "命令系统: 支持多种 AI 编辑命令",
        "状态管理: 管理 AI 对话的各种状态"
      ],
      codeExample: `// 流式响应处理
for await (const chunk of response) {
  fullText += chunk.data;
  setCompletion(fullText);
}

// 文本高亮
onFocus={() => addAIHighlight(editor)}`,
      tips: [
        "AI 功能需要后端 API 支持",
        "可以自定义 AI 命令和提示词",
        "注意处理 AI 响应的错误情况"
      ]
    }
  },
  {
    id: "slash-commands",
    title: "⚡ Slash 命令系统",
    description: "理解命令建议和动态内容插入",
    level: "intermediate",
    content: {
      overview: "Slash 命令提供了快速插入各种内容元素的方式。",
      keyPoints: [
        "命令建议: 输入 '/' 时显示可用命令列表",
        "搜索匹配: 支持模糊搜索和关键词匹配",
        "动态插入: 选择命令后自动插入对应内容",
        "可扩展性: 可以轻松添加自定义命令"
      ],
      codeExample: `// 命令配置
{
  title: "Heading 1",
  description: "Big section heading.",
  searchTerms: ["title", "big", "large"],
  icon: <Heading1 size={18} />,
  command: ({ editor, range }) => {
    editor.chain().focus().deleteRange(range)
      .setNode("heading", { level: 1 }).run();
  },
}`,
      tips: [
        "每个命令都有标题、描述和搜索关键词",
        "命令执行时会删除触发的 '/' 字符",
        "可以通过 searchTerms 提高命令的可发现性"
      ]
    }
  }
];

export function LearningGuide() {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">📚 编辑器学习指南</h2>
        <p className="text-muted-foreground">
          按照以下步骤深入学习 DeerFlow 编辑器的实现原理
        </p>
      </div>

      {learningSections.map((section) => (
        <Card key={section.id}>
          <Collapsible
            open={openSections.includes(section.id)}
            onOpenChange={() => toggleSection(section.id)}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      {openSections.includes(section.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <div>
                      <CardTitle className="text-left">{section.title}</CardTitle>
                      <CardDescription className="text-left">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getLevelColor(section.level)}>
                    {section.level}
                  </Badge>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {section.content.overview}
                  </p>
                  
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      关键要点
                    </h4>
                    <ul className="space-y-1 text-sm">
                      {section.content.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-muted-foreground mr-2">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {section.content.codeExample && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Code className="h-4 w-4 mr-2" />
                        代码示例
                      </h4>
                      <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                        <code>{section.content.codeExample}</code>
                      </pre>
                    </div>
                  )}

                  {section.content.tips && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Zap className="h-4 w-4 mr-2" />
                        学习提示
                      </h4>
                      <ul className="space-y-1 text-sm">
                        {section.content.tips.map((tip, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-yellow-500 mr-2">💡</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  );
}
