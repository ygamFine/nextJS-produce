/**
 * 处理图片 URL，确保它是完整的绝对 URL
 * @param url 原始图片 URL
 * @returns 处理后的完整 URL
 */
export function getImageUrl(url: string | null | undefined): string {
  // 如果 URL 为空，返回默认图片
  if (!url) return '/placeholder.jpg';
  
  // 如果已经是完整的 URL（以 http:// 或 https:// 开头），直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // 如果是相对路径但以 / 开头
  if (url.startsWith('/')) {
    // 检查是否是本地存储的图片（以 /images/ 开头）
    if (url.startsWith('/images/')) {
      return url;
    }
    
    // 否则，添加 Strapi 基础 URL
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || '';
    return `${strapiUrl}${url}`;
  }
  
  // 如果是相对路径但不以 / 开头，添加 /
  return `/${url}`;
}

/**
 * 下载并保存图片到本地
 * @param url 图片 URL
 * @returns 本地图片路径
 */
export async function downloadImage(url: string): Promise<string> {
  // 使用现有的图片下载逻辑
  // 这里可以调用 lib/image-downloader.ts 中的函数
  
  // 返回本地图片路径
  return url;
} 