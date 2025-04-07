import { redirect } from 'next/navigation'
import { fetchSupportedLocales } from '@/lib/api'

export default async function RootPage() {
  // 获取支持的语言列表
  const locales = await fetchSupportedLocales()
  
  // 默认重定向到第一个支持的语言
  const defaultLocale = locales[0]?.code || 'zh'
  
  // 重定向到默认语言的首页
  redirect(`/${defaultLocale}`)
}

// 添加 generateStaticParams 函数，确保在构建时生成
export function generateStaticParams() {
  return [];
}
