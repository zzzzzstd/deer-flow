#!/bin/bash

# AI Editor Standalone - 安装新依赖脚本
echo "🚀 开始安装 AI Editor Standalone 的新依赖..."

# 检查是否存在 package.json
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 未找到 package.json 文件"
    echo "请确保在项目根目录下运行此脚本"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖包..."
npm install

# 检查安装结果
if [ $? -eq 0 ]; then
    echo "✅ 依赖安装成功!"
    echo ""
    echo "🎉 新功能已添加:"
    echo "  • @tiptap/extension-table - 表格编辑支持"
    echo "  • framer-motion - 流畅的动画效果"
    echo "  • 优化的 Tailwind CSS 配置"
    echo ""
    echo "🚀 现在可以运行 'npm run dev' 启动开发服务器"
else
    echo "❌ 依赖安装失败，请检查网络连接或包管理器配置"
    exit 1
fi
