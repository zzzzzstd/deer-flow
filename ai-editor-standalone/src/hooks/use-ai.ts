/**
 * AI Hook
 * 管理AI状态和操作的自定义Hook
 */

import { useState, useCallback } from 'react'
import { fetchAIStream, type AIRequestOptions } from '@/lib/ai-api'
import { type AICommandOption, buildAIPrompt } from '@/lib/ai-commands'

export interface UseAIOptions {
  onError?: (error: Error) => void
  onComplete?: (result: string) => void
}

export interface UseAIReturn {
  // 状态
  isLoading: boolean
  completion: string
  error: Error | null
  
  // 操作
  complete: (options: AIRequestOptions) => Promise<string>
  executeCommand: (command: AICommandOption, selectedText?: string, customPrompt?: string) => Promise<string>
  reset: () => void
  abort: () => void
}

/**
 * AI Hook
 */
export function useAI(options: UseAIOptions = {}): UseAIReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [completion, setCompletion] = useState('')
  const [error, setError] = useState<Error | null>(null)
  const [abortController, setAbortController] = useState<AbortController | null>(null)

  const { onError, onComplete } = options

  // 重置状态
  const reset = useCallback(() => {
    setCompletion('')
    setError(null)
    setIsLoading(false)
    if (abortController) {
      abortController.abort()
      setAbortController(null)
    }
  }, [abortController])

  // 中止请求
  const abort = useCallback(() => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
    }
    setIsLoading(false)
  }, [abortController])

  // 执行AI完成
  const complete = useCallback(async (requestOptions: AIRequestOptions): Promise<string> => {
    setIsLoading(true)
    setError(null)
    setCompletion('')

    // 创建新的AbortController
    const controller = new AbortController()
    setAbortController(controller)

    try {
      let fullText = ''

      // 流式处理AI响应
      for await (const chunk of fetchAIStream(requestOptions)) {
        // 检查是否被中止
        if (controller.signal.aborted) {
          throw new Error('Request aborted')
        }

        fullText += chunk.data
        setCompletion(fullText)
      }

      setIsLoading(false)
      setAbortController(null)
      
      // 调用完成回调
      onComplete?.(fullText)
      
      return fullText
    } catch (err) {
      const error = err instanceof Error ? err : new Error('AI request failed')
      setError(error)
      setIsLoading(false)
      setAbortController(null)
      
      // 调用错误回调
      onError?.(error)
      
      throw error
    }
  }, [onError, onComplete])

  // 执行AI命令
  const executeCommand = useCallback(async (
    command: AICommandOption,
    selectedText?: string,
    customPrompt?: string
  ): Promise<string> => {
    const prompt = buildAIPrompt(command, selectedText, customPrompt)

    // 映射命令类型到API选项
    let option: 'improve' | 'shorter' | 'longer' | 'continue' | 'zap' = 'zap'
    switch (command.type) {
      case 'improve':
        option = 'improve'
        break
      case 'shorter':
        option = 'shorter'
        break
      case 'longer':
        option = 'longer'
        break
      case 'continue':
        option = 'continue'
        break
      case 'fix':
      case 'custom':
      default:
        option = 'zap'
        break
    }

    const requestOptions: AIRequestOptions = {
      prompt,
      option,
      command: customPrompt,
      context: selectedText,
    }

    return complete(requestOptions)
  }, [complete])

  return {
    // 状态
    isLoading,
    completion,
    error,
    
    // 操作
    complete,
    executeCommand,
    reset,
    abort,
  }
}

/**
 * 简化的AI完成Hook
 */
export function useAICompletion() {
  const [completion, setCompletion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const complete = useCallback(async (prompt: string, options?: Partial<AIRequestOptions>) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchAIStream({
        prompt,
        ...options,
      })

      let fullText = ''
      for await (const chunk of response) {
        fullText += chunk.data
        setCompletion(fullText)
      }

      setIsLoading(false)
      return fullText
    } catch (e) {
      const error = e instanceof Error ? e : new Error('An error occurred')
      setError(error)
      setIsLoading(false)
      throw error
    }
  }, [])

  const reset = useCallback(() => {
    setCompletion('')
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    completion,
    complete,
    isLoading,
    error,
    reset,
  }
}
