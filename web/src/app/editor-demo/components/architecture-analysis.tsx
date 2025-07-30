// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Code2, Layers, Zap } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components/ui/collapsible";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { DataFlowDemo } from "./data-flow-demo";

interface ArchitectureLayer {
  id: string;
  name: string;
  description: string;
  color: string;
  responsibilities: string[];
  codeExample: string;
  realImplementation: string;
}

const architectureLayers: ArchitectureLayer[] = [
  {
    id: "novel",
    name: "🎨 Novel (上层)",
    description: "React 组件界面层 - 提供开箱即用的编辑器组件",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    responsibilities: [
      "提供 React 组件封装 (EditorRoot, EditorContent)",
      "处理用户交互和事件 (handleImageDrop, handleImagePaste)",
      "集成 AI 功能 (GenerativeMenuSwitch)",
      "管理编辑器状态和生命周期",
      "提供现代化的 UI 组件"
    ],
    codeExample: `// Novel 上层组件使用
import { EditorRoot, EditorContent } from "novel";

<EditorRoot>
  <EditorContent
    extensions={extensions}
    editorProps={{
      handleDrop: handleImageDrop,
      handlePaste: handleImagePaste,
    }}
  >
    <GenerativeMenuSwitch>
      {/* AI 功能组件 */}
    </GenerativeMenuSwitch>
  </EditorContent>
</EditorRoot>`,
    realImplementation: `// DeerFlow 中的实际使用
const ReportEditor = ({ content, onMarkdownChange }) => {
  const [initialContent, setInitialContent] = useState(content);
  
  const debouncedUpdates = useDebouncedCallback(
    async (editor) => {
      const markdown = editor.storage.markdown.getMarkdown();
      onMarkdownChange(markdown);
    }, 500
  );

  return (
    <EditorRoot>
      <EditorContent
        extensions={extensions}
        onUpdate={({ editor }) => debouncedUpdates(editor)}
      />
    </EditorRoot>
  );
};`
  },
  {
    id: "tiptap",
    name: "⚙️ TipTap (中间层)",
    description: "扩展系统和框架适配层 - 将 ProseMirror 包装成现代框架友好的 API",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    responsibilities: [
      "扩展系统管理 (StarterKit, GlobalDragHandle)",
      "命令链式调用 (editor.chain().focus().run())",
      "插件配置和组合 (extensions 数组)",
      "React/Vue 框架集成",
      "简化 ProseMirror 复杂 API"
    ],
    codeExample: `// TipTap 扩展配置
const extensions = [
  StarterKit,           // 基础功能
  GlobalDragHandle,     // 拖拽功能
  SlashCommand,         // 斜杠命令
  AIHighlight,          // AI 高亮
  Markdown              // Markdown 支持
];

// 命令链式调用
editor.chain()
  .focus()
  .setHeading({ level: 1 })
  .run();`,
    realImplementation: `// DeerFlow 中的扩展配置
import {
  StarterKit, GlobalDragHandle, AIHighlight,
  TiptapImage, TiptapLink, Mathematics
} from "novel";

const globalDragHandle = GlobalDragHandle.configure({});
const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class: "text-muted-foreground underline"
  }
});

export const defaultExtensions = [
  starterKit, placeholder, tiptapLink,
  globalDragHandle, aiHighlight, mathematics
];`
  },
  {
    id: "prosemirror",
    name: "🔧 ProseMirror (底层)",
    description: "核心编辑器引擎 - 提供文档模型、状态管理和 DOM 操作",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    responsibilities: [
      "文档模型管理 (Schema, Node, Mark)",
      "状态管理和事务处理 (State, Transaction)",
      "DOM 操作和事件处理",
      "插件系统底层支持",
      "编辑器核心算法实现"
    ],
    codeExample: `// ProseMirror 底层概念
const schema = new Schema({
  nodes: {
    doc: { content: "block+" },
    paragraph: { content: "inline*", group: "block" },
    text: { group: "inline" }
  },
  marks: {
    bold: {},
    italic: {}
  }
});

// 状态和事务
const state = EditorState.create({ schema });
const transaction = state.tr.insertText("Hello");`,
    realImplementation: `// DeerFlow 中通过 TipTap 间接使用 ProseMirror
const tiptapImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [
      UploadImagesPlugin({
        imageClass: "opacity-40 rounded-lg border"
      })
    ];
  }
});

// 通过 TipTap 访问 ProseMirror 状态
const selectedText = editor.state.doc.textBetween(
  selection.from, 
  selection.to
);`
  }
];

export function ArchitectureAnalysis() {
  const [openLayers, setOpenLayers] = useState<string[]>(["novel"]);

  const toggleLayer = (layerId: string) => {
    setOpenLayers(prev => 
      prev.includes(layerId) 
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center">
          <Layers className="h-6 w-6 mr-2" />
          DeerFlow 三层架构深度解析
        </h2>
        <p className="text-muted-foreground">
          基于你的理论基础，深入分析 DeerFlow 项目中的实际架构实现
        </p>
      </div>

      {/* 主要内容标签页 */}
      <Tabs defaultValue="layers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="layers">架构层次</TabsTrigger>
          <TabsTrigger value="dataflow">数据流动</TabsTrigger>
        </TabsList>

        <TabsContent value="layers" className="mt-6">

      {/* 架构概览图 */}
      <Card>
        <CardHeader>
          <CardTitle>🏗️ 架构层次关系</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium">🎨 Novel (上层)</span>
              </div>
              <span className="text-sm text-muted-foreground">React 组件 + UI 交互</span>
            </div>
            <div className="flex justify-center">
              <div className="w-px h-8 bg-border"></div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 dark:bg-green-950">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">⚙️ TipTap (中间层)</span>
              </div>
              <span className="text-sm text-muted-foreground">扩展系统 + API 封装</span>
            </div>
            <div className="flex justify-center">
              <div className="w-px h-8 bg-border"></div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-orange-50 dark:bg-orange-950">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="font-medium">🔧 ProseMirror (底层)</span>
              </div>
              <span className="text-sm text-muted-foreground">核心引擎 + DOM 操作</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 各层详细分析 */}
      <div className="space-y-4">
        {architectureLayers.map((layer) => (
          <Card key={layer.id}>
            <Collapsible
              open={openLayers.includes(layer.id)}
              onOpenChange={() => toggleLayer(layer.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                        {openLayers.includes(layer.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      <div>
                        <CardTitle className="text-left">{layer.name}</CardTitle>
                        <CardDescription className="text-left">
                          {layer.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={layer.color}>
                      {layer.id.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent>
                  <Tabs defaultValue="responsibilities" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="responsibilities">核心职责</TabsTrigger>
                      <TabsTrigger value="example">代码示例</TabsTrigger>
                      <TabsTrigger value="implementation">实际实现</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="responsibilities" className="mt-4">
                      <ul className="space-y-2">
                        {layer.responsibilities.map((responsibility, index) => (
                          <li key={index} className="flex items-start">
                            <Zap className="h-4 w-4 mr-2 mt-0.5 text-yellow-500" />
                            <span className="text-sm">{responsibility}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                    
                    <TabsContent value="example" className="mt-4">
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{layer.codeExample}</code>
                      </pre>
                    </TabsContent>
                    
                    <TabsContent value="implementation" className="mt-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Code2 className="h-4 w-4" />
                          <span className="font-medium">DeerFlow 中的实际代码</span>
                        </div>
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                          <code>{layer.realImplementation}</code>
                        </pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
          </div>
        </TabsContent>

        <TabsContent value="dataflow" className="mt-6">
          <DataFlowDemo />
        </TabsContent>
      </Tabs>
    </div>
  );
}
