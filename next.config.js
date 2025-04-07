/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-api-domain.com', 'localhost', '127.0.0.1'],
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