#!/bin/bash

# AI Editor Standalone 开发启动脚本

echo "🚀 启动 AI Editor Standalone 开发环境"
echo ""

# 检查是否存在 .env.local 文件
if [ ! -f ".env.local" ]; then
    echo "⚠️  未找到 .env.local 文件"
    echo "📝 正在从示例文件创建..."
    cp .env.local.example .env.local
    echo "✅ 已创建 .env.local 文件，请根据需要修改配置"
    echo ""
fi
echo "✅ .env.local 文件已就绪"
# 检查依赖是否已安装
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖中..."
    npm install
    echo ""
fi

# 检查web项目后端是否运行
echo "🔍 检查后端服务状态..."
BACKEND_URL=${NEXT_PUBLIC_AI_BACKEND_URL:-"http://localhost:3000"}

if curl -s "$BACKEND_URL/api/prose/generate" > /dev/null 2>&1; then
    echo "✅ 后端服务运行正常: $BACKEND_URL"
else
    echo "❌ 后端服务未运行: $BACKEND_URL"
    echo ""
    echo "请先启动web项目后端："
    echo "  cd ../web"
    echo "  npm run dev"
    echo ""
    echo "然后重新运行此脚本"
    exit 1
fi

echo ""
echo "🎉 启动AI编辑器开发服务器..."
echo "📱 访问地址: http://localhost:3001"
echo ""

# 启动开发服务器
npm run dev
