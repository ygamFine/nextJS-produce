import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 支持的语言列表
const supportedLocales = ['zh', 'en', 'ja', 'asa', 'ar', 'my'] // 确保包含所有支持的语言
// 默认语言
const defaultLocale = 'zh'

export function middleware(request: NextRequest) {
  // 获取请求的路径名
  const pathname = request.nextUrl.pathname
  
  // 排除静态资源和API路由
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('.') ||
    pathname.startsWith('/locales')
  ) {
    return NextResponse.next()
  }
  
  // 检查路径是否已经包含语言前缀
  const pathnameHasLocale = supportedLocales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  
  // 如果路径不包含语言代码，重定向到默认语言
  if (!pathnameHasLocale) {
    // 从 cookie 或 accept-language 头获取用户偏好的语言
    const locale = 
      request.cookies.get('NEXT_LOCALE')?.value || 
      request.headers.get('accept-language')?.split(',')[0].split('-')[0] || 
      defaultLocale
    
    // 使用用户偏好的语言，如果不支持则使用默认语言
    const preferredLocale = supportedLocales.includes(locale) ? locale : defaultLocale
    
    // 创建新的 URL 对象
    const newUrl = new URL(
      `/${preferredLocale}${pathname === '/' ? '' : pathname}`,
      request.url
    )
    
    // 保留查询参数
    newUrl.search = request.nextUrl.search
    
    // 返回重定向响应
    return NextResponse.redirect(newUrl)
  }
  
  return NextResponse.next()
}

export const config = {
  // 匹配所有路径
  matcher: ['/((?!_next/static|_next/image|favicon.ico|locales/).*)'],
} 