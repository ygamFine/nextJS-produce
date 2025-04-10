/**
 * 检测当前环境
 * @returns 环境类型
 */
export function getEnvironment(): 'development' | 'production' | 'test' {
  if (process.env.NODE_ENV === 'production') {
    return 'production';
  }
  
  if (process.env.NODE_ENV === 'test') {
    return 'test';
  }
  
  return 'development';
}

/**
 * 获取当前环境的图片 URL 前缀
 * @returns 图片 URL 前缀
 */
export function getImageUrlPrefix(): string {
  const env = getEnvironment();
  
  if (env === 'production') {
    return process.env.IMAGE_URL_PREFIX_PROD || 'https://victorious-wisdom-f9f44dd049.strapiapp.com';
  }
  
  return process.env.IMAGE_URL_PREFIX_DEV || 'http://127.0.0.1:1337';
} 