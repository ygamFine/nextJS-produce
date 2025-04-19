/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost', // 本地开发
      '127.0.0.1',
      'victorious-wisdom-f9f44dd049.strapiapp.com',
      'victorious-wisdom-f9f44dd049.media.strapiapp.com', // 添加媒体域名
      'positive-song-f27137b058.strapiapp.com',
      'positive-song-f27137b058.media.strapiapp.com',
      'your-strapi-api.com',
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
  },
  // 添加 webpack 配置以处理 fs 模块
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig 