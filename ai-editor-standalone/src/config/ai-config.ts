/**
 * AI 配置文件
 * 管理AI相关的配置和环境变量
 */

export interface AIEnvironmentConfig {
  // 后端服务配置
  backendUrl: string
  timeout: number
  // CORS 配置
  corsEnabled: boolean
  allowedOrigins: string[]
  
}

// 默认配置
const DEFAULT_CONFIG: AIEnvironmentConfig = {
  // 默认连接到web项目的后端
  backendUrl: 'http://localhost:8000', // 根据用户反馈更新默认端口
  timeout: 30000,
  // CORS 配置
  corsEnabled: true,
  allowedOrigins: ['http://localhost:8000', 'http://localhost:3001'],
}

// 开发环境配置
const DEVELOPMENT_CONFIG: Partial<AIEnvironmentConfig> = {
  backendUrl: 'http://localhost:3000',
  corsEnabled: true,
  allowedOrigins: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
}

// 生产环境配置
const PRODUCTION_CONFIG: Partial<AIEnvironmentConfig> = {
  corsEnabled: false, // 生产环境通常不需要CORS
  timeout: 60000, // 生产环境更长的超时时间
}

/**
 * 获取当前环境的AI配置
 */
export function getAIConfig(): AIEnvironmentConfig {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isProduction = process.env.NODE_ENV === 'production'

  let config = { ...DEFAULT_CONFIG }

  // 从环境变量读取配置
  if (typeof window !== 'undefined') {
    // 客户端环境，从window对象读取Next.js注入的环境变量
    const backendUrl = (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_AI_BACKEND_URL
    if (backendUrl) {
      config.backendUrl = backendUrl
    }
  } else {
    // 服务端环境，直接从process.env读取
    if (process.env.NEXT_PUBLIC_AI_BACKEND_URL) {
      config.backendUrl = process.env.NEXT_PUBLIC_AI_BACKEND_URL
    }
  }

  if (isDevelopment) {
    config = { ...config, ...DEVELOPMENT_CONFIG }
  } else if (isProduction) {
    config = { ...config, ...PRODUCTION_CONFIG }
  }

  return config
}

/**
 * 验证AI配置
 */
export function validateAIConfig(config: AIEnvironmentConfig): boolean {
  if (!config.backendUrl) {
    console.error('AI配置错误: backendUrl 不能为空')
    return false
  }
  
  if (config.timeout <= 0) {
    console.error('AI配置错误: timeout 必须大于0')
    return false
  }
  return true
}

/**
 * 格式化后端URL
 */
export function formatBackendUrl(baseUrl: string, path: string): string {
  const cleanBaseUrl = baseUrl.replace(/\/$/, '')
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${cleanBaseUrl}${cleanPath}`
}

/**
 * 检查CORS是否需要处理
 */
export function shouldHandleCors(config: AIEnvironmentConfig, origin?: string): boolean {
  if (!config.corsEnabled) return false
  if (!origin) return true
  
  return config.allowedOrigins.some(allowedOrigin => 
    origin.startsWith(allowedOrigin)
  )
}
