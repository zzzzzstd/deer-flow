// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: MIT

import { createImageUpload } from "novel";

// 模拟图片上传函数
const onUpload = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // 创建本地 URL 用于预览
      const url = URL.createObjectURL(file);
      
      // 模拟上传延迟
      setTimeout(() => {
        resolve(url);
      }, 1000);
      
    } catch (error) {
      reject(new Error("图片上传失败，请重试"));
    }
  });
};

// 创建图片上传配置
export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    // 验证文件类型
    if (!file.type.includes("image/")) {
      console.error("文件类型不支持，请选择图片文件");
      return false;
    }
    
    // 验证文件大小 (最大 20MB)
    if (file.size / 1024 / 1024 > 20) {
      console.error("文件大小超过限制，最大支持 20MB");
      return false;
    }
    
    return true;
  },
});

// 导出图片处理相关的工具函数
export const imageUtils = {
  // 检查是否为图片文件
  isImageFile: (file: File): boolean => {
    return file.type.startsWith("image/");
  },
  
  // 格式化文件大小
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },
  
  // 创建图片预览
  createPreview: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error("无法创建图片预览"));
        }
      };
      reader.onerror = () => reject(new Error("读取文件失败"));
      reader.readAsDataURL(file);
    });
  },
};
