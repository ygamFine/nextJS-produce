/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost', // 本地开发
      '127.0.0.1',
      'victorious-wisdom-f9f44dd049.strapiapp.com',
      'victorious-wisdom-f9f44dd049.media.strapiapp.com', // 添加媒体域名
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
      {
        protocol: 'https',
        hostname: 'victorious-wisdom-f9f44dd049.strapiapp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'victorious-wisdom-f9f44dd049.media.strapiapp.com',
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