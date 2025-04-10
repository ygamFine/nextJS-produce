import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getImageUrl } from './imageUtils';

// 图片存储目录
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const IMAGE_DIR = path.join(PUBLIC_DIR, 'images');

// 确保图片目录存在
if (typeof window === 'undefined' && !fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

/**
 * 下载图片并保存到本地
 * @param url 图片 URL
 * @returns 本地图片路径
 */
export async function downloadImage(url: string): Promise<string> {
  // 如果 URL 为空，返回默认图片
  if (!url) return '/placeholder.jpg';
  
  // 处理 URL 格式
  const fullUrl = getImageUrl(url);
  
  try {
    // 生成文件名
    const hash = crypto.createHash('md5').update(fullUrl).digest('hex');
    const ext = path.extname(fullUrl) || '.jpg';
    const filename = `${hash}${ext}`;
    const localPath = path.join(IMAGE_DIR, filename);
    
    // 检查文件是否已存在
    if (fs.existsSync(localPath)) {
      return `/images/${filename}`;
    }
    
    // 下载图片
    const response = await fetch(fullUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(localPath, Buffer.from(buffer));
    
    return `/images/${filename}`;
  } catch (error) {
    console.error(`Error downloading image from ${fullUrl}:`, error);
    return '/placeholder.jpg';
  }
}

/**
 * 处理对象中的图片 URL
 * @param item 包含图片 URL 的对象
 * @param imageFields 图片字段名数组
 */
export async function processImages<T>(item: T, imageFields: (keyof T)[]): Promise<T> {
  const result = { ...item };
  
  for (const field of imageFields) {
    const url = item[field] as unknown as string;
    if (url) {
      const localPath = await downloadImage(url);
      (result[field] as unknown) = localPath;
    }
  }
  
  return result;
}

/**
 * 处理数组中所有对象的图片 URL
 * @param items 对象数组
 * @param imageFields 图片字段名数组
 */
export async function processItemsImages<T>(items: T[], imageFields: (keyof T)[]): Promise<T[]> {
  return Promise.all(items.map(item => processImages(item, imageFields)));
} 