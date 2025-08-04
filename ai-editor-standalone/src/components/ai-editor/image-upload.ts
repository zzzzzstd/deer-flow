import { createImageUpload } from "novel"

// 模拟图片上传函数
const onUpload = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // 创建本地 URL 用于预览
      const url = URL.createObjectURL(file)
      
      // 模拟上传延迟
      setTimeout(() => {
        resolve(url)
      }, 1000)
      
    } catch (error) {
      reject(new Error("图片上传失败，请重试"))
    }
  })
}

// 创建图片上传配置
export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    // 检查文件是否存在
    if (!file) {
      console.error("未选择文件")
      return false
    }

    // 验证文件类型
    if (!file.type || !file.type.includes("image/")) {
      console.error("文件类型不支持，请选择图片文件")
      return false
    }

    // 验证文件大小 (最大 20MB)
    if (file.size / 1024 / 1024 > 20) {
      console.error("文件大小超过限制，最大支持 20MB")
      return false
    }

    return true
  },
})
