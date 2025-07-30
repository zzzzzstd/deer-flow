// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

"use client";

import { CheckCircle, Target, Lightbulb, Code, Rocket } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

// 简单的进度条组件
const Progress = ({ value, className }: { value: number; className?: string }) => (
  <div className={`w-full bg-muted rounded-full ${className}`}>
    <div
      className="bg-primary rounded-full transition-all duration-300 ease-out"
      style={{ width: `${Math.min(100, Math.max(0, value))}%`, height: '100%' }}
    />
  </div>
);

interface LearningAchievement {
  category: string;
  items: {
    title: string;
    description: string;
    mastery: number;
    evidence: string;
  }[];
}

const learningAchievements: LearningAchievement[] = [
  {
    category: "🏗️ 架构理解",
    items: [
      {
        title: "三层架构职责划分",
        description: "清晰理解 Novel、TipTap、ProseMirror 各层职责",
        mastery: 95,
        evidence: "能准确描述每层的核心功能和边界"
      },
      {
        title: "数据流向掌握",
        description: "理解用户操作到界面更新的完整流程",
        mastery: 90,
        evidence: "能追踪 Slash 命令的完整执行路径"
      },
      {
        title: "扩展系统认知",
        description: "理解 TipTap 扩展系统的工作原理",
        mastery: 85,
        evidence: "能分析 GlobalDragHandle 等扩展的实现"
      }
    ]
  },
  {
    category: "💻 代码实践",
    items: [
      {
        title: "组件使用能力",
        description: "熟练使用 Novel 提供的 React 组件",
        mastery: 88,
        evidence: "成功创建独立的编辑器演示页面"
      },
      {
        title: "扩展配置技能",
        description: "能够配置和组合各种 TipTap 扩展",
        mastery: 82,
        evidence: "理解 defaultExtensions 数组的组织方式"
      },
      {
        title: "事件处理理解",
        description: "掌握编辑器事件的处理机制",
        mastery: 78,
        evidence: "理解 handleImageDrop、handleImagePaste 等事件"
      }
    ]
  },
  {
    category: "🤖 AI 集成",
    items: [
      {
        title: "AI 选择器机制",
        description: "理解 AI 功能的触发和交互流程",
        mastery: 85,
        evidence: "能分析 GenerativeMenuSwitch 的工作原理"
      },
      {
        title: "流式响应处理",
        description: "掌握 AI 流式响应的实现方式",
        mastery: 80,
        evidence: "理解 fetchStream 和实时更新机制"
      },
      {
        title: "文本高亮功能",
        description: "理解 AI 文本高亮的实现原理",
        mastery: 75,
        evidence: "知道 addAIHighlight 和 removeAIHighlight 的作用"
      }
    ]
  }
];

const nextSteps = [
  {
    icon: <Code className="h-5 w-5" />,
    title: "深入 TipTap 扩展开发",
    description: "学习创建自定义扩展，如自定义 Slash 命令",
    priority: "高"
  },
  {
    icon: <Target className="h-5 w-5" />,
    title: "研究 ProseMirror 核心概念",
    description: "深入学习 Schema、Node、Mark 等底层概念",
    priority: "中"
  },
  {
    icon: <Rocket className="h-5 w-5" />,
    title: "实践项目开发",
    description: "开发一个完整的编辑器插件或功能",
    priority: "高"
  },
  {
    icon: <Lightbulb className="h-5 w-5" />,
    title: "性能优化学习",
    description: "学习编辑器性能优化的最佳实践",
    priority: "低"
  }
];

export function LearningSummary() {
  const overallMastery = Math.round(
    learningAchievements.reduce((acc, category) => 
      acc + category.items.reduce((sum, item) => sum + item.mastery, 0) / category.items.length
    , 0) / learningAchievements.length
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center">
          <CheckCircle className="h-6 w-6 mr-2 text-green-500" />
          学习成果总结
        </h2>
        <p className="text-muted-foreground">
          基于你的学习报告和实际操作，评估当前的掌握程度
        </p>
      </div>

      {/* 总体进度 */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 总体掌握程度</CardTitle>
          <CardDescription>
            综合评估你对 Novel + TipTap + ProseMirror 架构的理解程度
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">整体掌握度</span>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {overallMastery}%
              </Badge>
            </div>
            <Progress value={overallMastery} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {overallMastery >= 90 ? "🎉 优秀！已经具备了深入开发的能力" :
               overallMastery >= 80 ? "👍 良好！可以开始实际项目开发" :
               overallMastery >= 70 ? "📚 不错！需要更多实践巩固" :
               "💪 继续努力！建议多做实践练习"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 分类成就 */}
      <div className="grid gap-6">
        {learningAchievements.map((category, categoryIndex) => (
          <Card key={categoryIndex}>
            <CardHeader>
              <CardTitle>{category.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{item.title}</h4>
                      <Badge 
                        variant={item.mastery >= 85 ? "default" : item.mastery >= 75 ? "secondary" : "outline"}
                      >
                        {item.mastery}%
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <Progress value={item.mastery} className="h-2" />
                    <p className="text-xs text-muted-foreground italic">
                      ✓ {item.evidence}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 下一步学习建议 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Rocket className="h-5 w-5" />
            <span>下一步学习建议</span>
          </CardTitle>
          <CardDescription>
            基于当前掌握程度，为你推荐后续的学习路径
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {nextSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {step.icon}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{step.title}</h4>
                    <Badge 
                      variant={step.priority === "高" ? "destructive" : 
                              step.priority === "中" ? "default" : "secondary"}
                    >
                      {step.priority}优先级
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 学习方法总结 */}
      <Card>
        <CardHeader>
          <CardTitle>📚 学习方法总结</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
              <span><strong>理论与实践结合</strong>：通过学习报告建立理论基础，通过编辑器演示验证理解</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
              <span><strong>分层递进学习</strong>：从架构概览到具体实现，逐层深入理解</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
              <span><strong>代码实例验证</strong>：通过 DeerFlow 实际代码加深对概念的理解</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
              <span><strong>互动式探索</strong>：通过实际操作编辑器功能体验架构设计</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
