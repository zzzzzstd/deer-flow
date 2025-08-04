import { type EditorInstance, type JSONContent } from "novel"

export interface AIEditorProps {
  /**
   * 编辑器的初始内容
   */
  initialContent?: JSONContent
  
  /**
   * 占位符文本
   */
  placeholder?: string
  
  /**
   * 自定义CSS类名
   */
  className?: string
  
  /**
   * 内容变化回调
   */
  onContentChange?: (content: JSONContent) => void
  
  /**
   * Markdown内容变化回调
   */
  onMarkdownChange?: (markdown: string) => void
  
  /**
   * 编辑器创建回调
   */
  onEditorCreate?: (editor: EditorInstance) => void
  
  /**
   * AI生成函数
   */
  onAIGenerate?: (prompt: string, context?: string) => Promise<string>
  
  /**
   * 是否禁用AI功能
   */
  disableAI?: boolean
  
  /**
   * 是否禁用图片上传
   */
  disableImageUpload?: boolean
  
  /**
   * 自定义图片上传函数
   */
  onImageUpload?: (file: File) => Promise<string>
}

export interface AIToolbarProps {
  editor: EditorInstance | null
  onAIClick: () => void
  isLoading: boolean
}

export interface AIAssistantProps {
  selectedText: string
  suggestion: string
  isLoading: boolean
  onGenerate: (prompt: string, context?: string) => Promise<void>
  onInsert: (text: string) => void
  onReplace: (text: string) => void
  onClose: () => void
}

export interface SlashCommandItem {
  title: string
  description: string
  searchTerms: string[]
  icon: React.ReactNode
  command: ({ editor, range }: { editor: EditorInstance; range: any }) => void
}
