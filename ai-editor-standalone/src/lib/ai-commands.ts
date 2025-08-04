/**
 * AI 命令定义
 * 统一的AI操作命令和选项
 */

import { 
  RefreshCcwDot, 
  ArrowDownWideNarrow, 
  WrapText, 
  StepForward, 
  CheckCheck,
  Edit3,
  Plus,
  Wand2,
  Check,
  type LucideIcon
} from "lucide-react"

// AI 命令类型
export type AICommandType = 'improve' | 'shorter' | 'longer' | 'continue' | 'fix' | 'custom'

// AI 命令选项
export interface AICommandOption {
  id: string
  type: AICommandType
  label: string
  description: string
  icon: LucideIcon
  prompt: string
  requiresSelection?: boolean
  category: 'edit' | 'generate' | 'improve'
}

// 预定义的AI命令
export const AI_COMMANDS: AICommandOption[] = [
  // 编辑类命令
  {
    id: 'improve',
    type: 'improve',
    label: '改进文字',
    description: '让文字更清晰、更有说服力',
    icon: RefreshCcwDot,
    prompt: '请帮我改进这段文字，让它更清晰、更有说服力',
    requiresSelection: true,
    category: 'improve',
  },
  {
    id: 'shorter',
    type: 'shorter',
    label: '缩短内容',
    description: '保持核心意思，使内容更简洁',
    icon: ArrowDownWideNarrow,
    prompt: '请帮我缩短这段内容，保持核心意思但使其更简洁',
    requiresSelection: true,
    category: 'edit',
  },
  {
    id: 'longer',
    type: 'longer',
    label: '扩展内容',
    description: '添加更多细节和例子',
    icon: WrapText,
    prompt: '请帮我扩展这段内容，添加更多细节和例子',
    requiresSelection: true,
    category: 'edit',
  },
  {
    id: 'fix',
    type: 'fix',
    label: '修正语法',
    description: '检查并修正语法和表达',
    icon: CheckCheck,
    prompt: '请帮我检查并修正这段文字的语法和表达',
    requiresSelection: true,
    category: 'improve',
  },
  
  // 生成类命令
  {
    id: 'continue',
    type: 'continue',
    label: '继续写作',
    description: '基于当前内容继续写作',
    icon: StepForward,
    prompt: '请基于这段内容继续写作',
    requiresSelection: false,
    category: 'generate',
  },
]

// 快速操作命令（用于AI助手面板）
export const QUICK_AI_PROMPTS: Array<{
  label: string
  prompt: string
  icon: LucideIcon
}> = [
  { 
    label: "改进文字", 
    prompt: "请帮我改进这段文字，让它更清晰、更有说服力", 
    icon: Edit3 
  },
  { 
    label: "扩展内容", 
    prompt: "请帮我扩展这段内容，添加更多细节和例子", 
    icon: Plus 
  },
  { 
    label: "总结要点", 
    prompt: "请帮我总结这段文字的核心要点", 
    icon: Wand2 
  },
  { 
    label: "修正语法", 
    prompt: "请帮我检查并修正这段文字的语法和表达", 
    icon: Check 
  },
]

/**
 * 根据ID获取AI命令
 */
export function getAICommand(id: string): AICommandOption | undefined {
  return AI_COMMANDS.find(cmd => cmd.id === id)
}

/**
 * 根据类型获取AI命令
 */
export function getAICommandsByType(type: AICommandType): AICommandOption[] {
  return AI_COMMANDS.filter(cmd => cmd.type === type)
}

/**
 * 根据分类获取AI命令
 */
export function getAICommandsByCategory(category: 'edit' | 'generate' | 'improve'): AICommandOption[] {
  return AI_COMMANDS.filter(cmd => cmd.category === category)
}

/**
 * 构建AI提示词
 */
export function buildAIPrompt(command: AICommandOption, selectedText?: string, customPrompt?: string): string {
  if (customPrompt) {
    return selectedText ? `${customPrompt}：${selectedText}` : customPrompt
  }
  
  if (command.requiresSelection && selectedText) {
    return `${command.prompt}：${selectedText}`
  }
  
  return command.prompt
}

/**
 * 验证命令是否可执行
 */
export function canExecuteCommand(command: AICommandOption, hasSelection: boolean): boolean {
  if (command.requiresSelection && !hasSelection) {
    return false
  }
  return true
}
