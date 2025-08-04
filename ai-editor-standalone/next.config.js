/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // 配置代理以避免CORS问题
  async rewrites() {
    return [
      {
        source: '/api/prose/:path*',
        destination: `${process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://localhost:8000'}/api/prose/:path*`,
      },
    ]
  },
  // 配置CORS头
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
