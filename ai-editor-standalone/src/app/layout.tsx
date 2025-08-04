import type { Metadata } from 'next'
import '../styles/globals.css'
import '../components/ai-editor/ai-editor.css'


export const metadata: Metadata = {
  title: 'AI Editor Standalone',
  description: '独立的AI编辑器组件，基于Novel + TipTap + ProseMirror技术栈',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
