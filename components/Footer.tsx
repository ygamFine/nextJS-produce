import Link from 'next/link'

interface FooterProps {
  copyright: string;
  links: Array<{
    text: string;
    url: string;
  }>;
  socialMedia: Array<{
    platform: string;
    url: string;
  }>;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
  };
  locale?: string;
}

export function Footer({ copyright, links, socialMedia, contactInfo, locale = 'en' }: FooterProps) {
  // 添加调试代码
  console.log('Footer locale:', locale);
  
  // 确保 locale 有值
  const safeLocale = locale || 'en';
  
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 联系信息 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">联系我们</h3>
            <ul className="space-y-2">
              {contactInfo.address && (
                <li className="flex items-start">
                  <svg className="h-6 w-6 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{contactInfo.address}</span>
                </li>
              )}
              {contactInfo.phone && (
                <li className="flex items-center">
                  <svg className="h-6 w-6 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{contactInfo.phone}</span>
                </li>
              )}
              {contactInfo.email && (
                <li className="flex items-center">
                  <svg className="h-6 w-6 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{contactInfo.email}</span>
                </li>
              )}
            </ul>
          </div>
          
          {/* 快速链接 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              {links.map((link, index) => (
                <li key={index}>
                  <Link href={link.url} className="text-gray-300 hover:text-white">
                    {link.text}
                  </Link>
                </li>
              ))}
              {links.length === 0 && (
                <>
                  <li>
                    <Link href="/" className="text-gray-300 hover:text-white">
                      首页
                    </Link>
                  </li>
                  <li>
                    <Link href="/products" className="text-gray-300 hover:text-white">
                      产品中心
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="text-gray-300 hover:text-white">
                      关于我们
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-gray-300 hover:text-white">
                      联系我们
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          
          {/* 社交媒体 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">关注我们</h3>
            <div className="flex space-x-4">
              {socialMedia.map((item, index) => (
                <a 
                  key={index}
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  {/* 这里可以根据平台名称显示不同的图标 */}
                  <span className="sr-only">{item.platform}</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"/>
                  </svg>
                </a>
              ))}
              {socialMedia.length === 0 && (
                <p className="text-gray-400">暂无社交媒体链接</p>
              )}
            </div>
          </div>
        </div>
        
        {/* 版权信息 */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>{copyright}</p>
          <div className="mt-2">
            <Link href={`/${safeLocale}/sitemap`} className="text-gray-400 hover:text-white">
              {safeLocale === 'en' ? 'Sitemap' : '站点地图'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 