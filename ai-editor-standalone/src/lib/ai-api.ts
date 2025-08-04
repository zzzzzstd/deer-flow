/**
 * AI API 集成模块
 * 负责与后端AI服务的通信
 */

import { getAIConfig, formatBackendUrl, validateAIConfig } from '@/config/ai-config'

// AI API 配置
export interface AIConfig {
  baseUrl: string
  apiKey?: string
  timeout?: number
}

// AI 请求选项
export interface AIRequestOptions {
  prompt: string
  option?: 'improve' | 'shorter' | 'longer' | 'continue' | 'zap'
  command?: string
  context?: string
}

// AI 响应数据
export interface AIResponseChunk {
  data: string
  done?: boolean
}

// 获取默认配置
function getDefaultConfig(): AIConfig {
  const envConfig = getAIConfig()
  return {
    baseUrl: envConfig.backendUrl,
    timeout: envConfig.timeout,
  }
}

let currentConfig: AIConfig = getDefaultConfig()

/**
 * 配置AI API
 */
export function configureAI(config: Partial<AIConfig>) {
  const newConfig = { ...currentConfig, ...config }

  // 验证配置
  const envConfig = getAIConfig()
  if (!validateAIConfig({
    ...envConfig,
    backendUrl: newConfig.baseUrl,
    timeout: newConfig.timeout || envConfig.timeout,
  })) {
    console.warn('AI配置验证失败，使用默认配置')
    return
  }

  currentConfig = newConfig
}

/**
 * 获取当前AI配置
 */
export function getCurrentAIConfig(): AIConfig {
  return { ...currentConfig }
}

/**
 * 解析服务URL
 */
function resolveServiceURL(path: string): string {
  return formatBackendUrl(currentConfig.baseUrl, path)
}

/**
 * 流式获取AI响应
 */
export async function* fetchAIStream(
  options: AIRequestOptions
): AsyncIterable<AIResponseChunk> {
  // 在开发环境中，优先使用代理路径避免CORS问题
  const isDevelopment = process.env.NODE_ENV === 'development'
  const url = isDevelopment
    ? '/api/prose/generate' // 使用Next.js代理
    : resolveServiceURL('/api/prose/generate') // 直接调用后端

  // 构建请求头
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // 添加认证头
  if (currentConfig.apiKey) {
    headers['Authorization'] = `Bearer ${currentConfig.apiKey}`
  }

  // 添加CORS头（如果需要）
  const envConfig = getAIConfig()
  if (envConfig.corsEnabled) {
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      mode: envConfig.corsEnabled ? 'cors' : 'same-origin',
      credentials: 'omit', // 避免CORS问题
      body: JSON.stringify({
        prompt: options.prompt,
        option: options.option || 'zap',
        command: options.command || '',
        context: options.context,
      }),
      signal: AbortSignal.timeout(currentConfig.timeout || 30000),
    })

    if (!response.ok) {
      // 提供更详细的错误信息
      let errorMessage = `AI API request failed: ${response.status} ${response.statusText}`

      try {
        const errorText = await response.text()
        if (errorText) {
          errorMessage += ` - ${errorText}`
        }
      } catch (e) {
        // 忽略解析错误响应的错误
      }

      throw new Error(errorMessage)
    }

    if (!response.body) {
      throw new Error('Response body is empty')
    }

    // 直接yield解析的响应
    yield* parseStreamResponse(response.body)
  } catch (error) {
    // 处理网络错误和CORS错误
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`网络连接失败，请检查后端服务是否运行在 ${currentConfig.baseUrl}`)
    }

    if (error instanceof Error && error.message.includes('CORS')) {
      throw new Error(`CORS错误，请检查后端服务的CORS配置`)
    }

    throw error
  }
}

/**
 * 解析流式响应 - 基于web项目的实现
 */
async function* parseStreamResponse(
  body: ReadableStream<Uint8Array>
): AsyncIterable<AIResponseChunk> {
  const reader = body.pipeThrough(new TextDecoderStream()).getReader()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      buffer += value

      // 按照Server-Sent Events格式解析，事件以'\n\n'结束
      while (true) {
        const index = buffer.indexOf('\n\n')
        if (index === -1) {
          break
        }

        const chunk = buffer.slice(0, index)
        buffer = buffer.slice(index + 2)

        const event = parseEvent(chunk)
        if (event && event.data) {
          yield { data: event.data, done: false }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}

/**
 * 解析单个事件 - 基于web项目的实现
 */
function parseEvent(chunk: string): { event: string; data: string } | null {
  let resultEvent = 'message'
  let resultData: string | null = null

  for (const line of chunk.split('\n')) {
    const pos = line.indexOf(': ')
    if (pos === -1) {
      continue
    }

    const key = line.slice(0, pos)
    const value = line.slice(pos + 2)

    if (key === 'event') {
      resultEvent = value
    } else if (key === 'data') {
      resultData = value
    }
  }

  if (resultEvent === 'message' && resultData === null) {
    return null
  }

  return {
    event: resultEvent,
    data: resultData || '',
  }
}

/**
 * 非流式获取AI响应
 */
export async function fetchAICompletion(
  options: AIRequestOptions
): Promise<string> {
  let fullResponse = ''
  
  for await (const chunk of fetchAIStream(options)) {
    fullResponse += chunk.data
  }
  
  return fullResponse
}
