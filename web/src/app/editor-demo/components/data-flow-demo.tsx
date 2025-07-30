// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, ArrowDown, ArrowUp } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

interface FlowStep {
  id: number;
  layer: "novel" | "tiptap" | "prosemirror";
  action: string;
  description: string;
  code: string;
}

const dataFlowSteps: FlowStep[] = [
  {
    id: 1,
    layer: "novel",
    action: "用户输入 '/'",
    description: "用户在编辑器中输入斜杠字符",
    code: "// Novel 捕获键盘事件\nhandleKeyDown(event) {\n  if (event.key === '/') {\n    // 触发 slash 命令\n  }\n}"
  },
  {
    id: 2,
    layer: "tiptap",
    action: "TipTap 处理命令",
    description: "TipTap 的 SlashCommand 扩展检测到 '/' 输入",
    code: "// TipTap SlashCommand 扩展\nconst SlashCommand = Extension.create({\n  addKeyboardShortcuts() {\n    return {\n      '/': () => this.editor.commands.showSuggestions()\n    }\n  }\n})"
  },
  {
    id: 3,
    layer: "prosemirror",
    action: "ProseMirror 状态更新",
    description: "ProseMirror 更新文档状态并触发插件",
    code: "// ProseMirror 状态管理\nconst transaction = state.tr.insertText('/');\nconst newState = state.apply(transaction);\n// 触发插件钩子"
  },
  {
    id: 4,
    layer: "tiptap",
    action: "显示命令菜单",
    description: "TipTap 根据配置显示可用命令列表",
    code: "// TipTap 命令建议\nconst suggestionItems = [\n  {\n    title: 'Heading 1',\n    command: ({ editor, range }) => {\n      editor.chain().deleteRange(range)\n        .setHeading({ level: 1 }).run()\n    }\n  }\n]"
  },
  {
    id: 5,
    layer: "novel",
    action: "渲染 UI 组件",
    description: "Novel 渲染命令菜单的 React 组件",
    code: "// Novel UI 组件渲染\n<EditorCommand>\n  <EditorCommandList>\n    {suggestionItems.map(item => (\n      <EditorCommandItem\n        onCommand={item.command}\n      >\n        {item.title}\n      </EditorCommandItem>\n    ))}\n  </EditorCommandList>\n</EditorCommand>"
  },
  {
    id: 6,
    layer: "novel",
    action: "用户选择命令",
    description: "用户点击 'Heading 1' 命令",
    code: "// Novel 处理用户点击\nconst handleCommand = (command) => {\n  command({ editor, range });\n  // 执行对应的编辑器命令\n}"
  },
  {
    id: 7,
    layer: "tiptap",
    action: "执行命令链",
    description: "TipTap 执行命令链，删除 '/' 并设置标题",
    code: "// TipTap 命令链执行\neditor.chain()\n  .focus()\n  .deleteRange(range)\n  .setHeading({ level: 1 })\n  .run()"
  },
  {
    id: 8,
    layer: "prosemirror",
    action: "DOM 更新",
    description: "ProseMirror 更新 DOM，将段落转换为 H1 标题",
    code: "// ProseMirror DOM 更新\nconst transaction = state.tr\n  .replaceWith(from, to, schema.nodes.heading.create(\n    { level: 1 },\n    schema.text('新标题')\n  ));\nview.dispatch(transaction);"
  }
];

const getLayerColor = (layer: string) => {
  switch (layer) {
    case "novel": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "tiptap": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "prosemirror": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const getLayerIcon = (layer: string) => {
  switch (layer) {
    case "novel": return "🎨";
    case "tiptap": return "⚙️";
    case "prosemirror": return "🔧";
    default: return "📦";
  }
};

export function DataFlowDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < dataFlowSteps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, 2000);
    } else if (currentStep >= dataFlowSteps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep]);

  const handlePlay = () => {
    if (currentStep >= dataFlowSteps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🔄 数据流动演示</span>
          </CardTitle>
          <CardDescription>
            观看用户输入 "/" 命令时，数据如何在三层架构中流动
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlay}
              className="flex items-center space-x-2"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isPlaying ? "暂停" : "播放"}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>重置</span>
            </Button>
            <Badge variant="secondary">
              步骤 {currentStep + 1} / {dataFlowSteps.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataFlowSteps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* 连接线 */}
                {index < dataFlowSteps.length - 1 && (
                  <div className="absolute left-6 top-16 w-px h-8 bg-border"></div>
                )}
                
                {/* 步骤卡片 */}
                <div
                  className={`
                    border rounded-lg p-4 cursor-pointer transition-all duration-300
                    ${index <= currentStep 
                      ? 'border-primary bg-primary/5 shadow-sm' 
                      : 'border-border bg-background opacity-50'
                    }
                    ${index === currentStep ? 'ring-2 ring-primary ring-offset-2' : ''}
                  `}
                  onClick={() => handleStepClick(index)}
                >
                  <div className="flex items-start space-x-4">
                    {/* 步骤编号和层级图标 */}
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold
                        ${index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                      `}>
                        {step.id}
                      </div>
                      <Badge className={getLayerColor(step.layer)}>
                        {getLayerIcon(step.layer)} {step.layer.toUpperCase()}
                      </Badge>
                    </div>
                    
                    {/* 步骤内容 */}
                    <div className="flex-1 space-y-2">
                      <h4 className="font-medium">{step.action}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      
                      {/* 代码示例 */}
                      {index <= currentStep && (
                        <div className="mt-3">
                          <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                            <code>{step.code}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                    
                    {/* 流向箭头 */}
                    {index < dataFlowSteps.length - 1 && (
                      <div className="flex items-center">
                        {step.layer !== dataFlowSteps[index + 1].layer && (
                          <div className="text-muted-foreground">
                            {step.layer === "novel" && dataFlowSteps[index + 1].layer === "tiptap" && (
                              <ArrowDown className="h-4 w-4" />
                            )}
                            {step.layer === "tiptap" && dataFlowSteps[index + 1].layer === "prosemirror" && (
                              <ArrowDown className="h-4 w-4" />
                            )}
                            {step.layer === "prosemirror" && dataFlowSteps[index + 1].layer === "tiptap" && (
                              <ArrowUp className="h-4 w-4" />
                            )}
                            {step.layer === "tiptap" && dataFlowSteps[index + 1].layer === "novel" && (
                              <ArrowUp className="h-4 w-4" />
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* 总结 */}
      <Card>
        <CardHeader>
          <CardTitle>💡 数据流总结</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p><strong>向下流动</strong>：用户操作 → Novel 组件 → TipTap 扩展 → ProseMirror 核心</p>
            <p><strong>向上反馈</strong>：ProseMirror 状态变化 → TipTap 事件 → Novel 组件更新</p>
            <p><strong>关键特点</strong>：每一层都有明确的职责，数据流动清晰可追踪</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
