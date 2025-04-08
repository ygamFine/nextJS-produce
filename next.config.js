/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost', // 本地开发
      'your-strapi-domain.com', // 替换为你的 Strapi 域名
      'your-production-domain.com', // 替换为你的生产域名
    ],
    // 可选：配置图片缓存时间（单位：秒）
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7天
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '1337',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // 移除不支持的选项
    // isrMemoryCacheSize: 50,
  }
}

module.exports = nextConfig 