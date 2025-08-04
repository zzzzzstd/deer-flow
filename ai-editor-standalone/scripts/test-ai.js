#!/usr/bin/env node

/**
 * AI功能测试脚本
 * 测试与后端AI服务的连接
 */

const https = require('https')
const http = require('http')

// 从环境变量或默认值获取后端URL
const BACKEND_URL = process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://localhost:8002'

console.log('🧪 测试AI后端连接...')
console.log(`📡 后端地址: ${BACKEND_URL}`)

// 解析URL
const url = new URL(BACKEND_URL)
const isHttps = url.protocol === 'https:'
const client = isHttps ? https : http

// 测试数据
const testData = JSON.stringify({
  prompt: '测试AI连接',
  option: 'zap',
  command: '',
  context: ''
})

// 请求选项
const options = {
  hostname: url.hostname,
  port: url.port || (isHttps ? 443 : 80),
  path: '/api/prose/generate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(testData)
  },
  timeout: 10000
}

console.log('🚀 发送测试请求...')

const req = client.request(options, (res) => {
  console.log(`📊 响应状态: ${res.statusCode}`)
  console.log(`📋 响应头:`, res.headers)

  if (res.statusCode === 200) {
    console.log('✅ 连接成功！')

    let data = ''
    res.on('data', (chunk) => {
      data += chunk
      process.stdout.write('.')
    })

    res.on('end', () => {
      console.log('\n📝 响应数据预览:')
      console.log(data.substring(0, 200) + (data.length > 200 ? '...' : ''))
      console.log('\n🎉 AI后端测试完成！')
    })
  } else {
    console.log('❌ 连接失败')
    console.log(`错误状态码: ${res.statusCode}`)

    let errorData = ''
    res.on('data', (chunk) => {
      errorData += chunk
    })

    res.on('end', () => {
      console.log('错误信息:', errorData)
    })
  }
})

req.on('error', (error) => {
  console.log('❌ 请求失败:')

  if (error.code === 'ECONNREFUSED') {
    console.log('🔌 连接被拒绝 - 请检查后端服务是否运行')
    console.log('💡 启动后端服务:')
    console.log('   cd ../web')
    console.log('   npm run dev')
  } else if (error.code === 'ENOTFOUND') {
    console.log('🌐 域名解析失败 - 请检查后端URL配置')
  } else if (error.code === 'ETIMEDOUT') {
    console.log('⏰ 请求超时 - 后端服务响应缓慢')
  } else {
    console.log('🐛 未知错误:', error.message)
  }

  console.log('\n🔧 故障排除建议:')
  console.log('1. 确认web项目后端正在运行')
  console.log('2. 检查 .env.local 中的 NEXT_PUBLIC_AI_BACKEND_URL 配置')
  console.log('3. 确认防火墙设置允许连接')
  console.log('4. 检查网络连接')
})

req.on('timeout', () => {
  console.log('⏰ 请求超时')
  req.destroy()
})

// 发送请求数据
req.write(testData)
req.end()

console.log('⏳ 等待响应...')
