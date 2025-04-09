'use client'
import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'
import type { MenuItem } from '@/lib/types'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useLocale } from '@/contexts/LocaleContext'
import { ClientOnly } from './ClientOnly'
import { switchLanguage } from '@/lib/languageUtils'
import { usePathname } from 'next/navigation'
import { SearchBox } from './SearchBox'

interface HeaderProps {
  siteName: string;
  logo: string;
  menuItems?: MenuItem[];
}

export function Header({ siteName, logo, menuItems = [] }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { locale, setLocale, availableLocales } = useLocale()  // 获取当前语言
  const pathname = usePathname()
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value
    
    // 使用专用函数切换语言
    if (typeof window !== 'undefined') {
      const availableLocaleCodes = availableLocales.map(loc => loc.code)
      switchLanguage(locale, newLocale, pathname || '/', availableLocaleCodes)
    } else {
      // 如果在服务器端，使用常规方法
      setLocale(newLocale)
    }
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* 首页链接添加语言前缀 */}
            <Link href={`/${locale}`} className="flex-shrink-0 flex items-center">
              <ClientOnly fallback={<div className="h-8 w-8 bg-gray-200 rounded-full"></div>}>
                <Image 
                  src={logo || '/logo.png'} 
                  alt={siteName} 
                  width={32} 
                  height={32} 
                  className="h-8 w-auto"
                />
              </ClientOnly>
              <span className="ml-2 text-lg font-semibold">{siteName}</span>
            </Link>
            
            {/* 桌面端导航 */}
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              {menuItems.map(item => {
                // 处理链接
                let href = item.href
                if (!href.startsWith('/') && !href.startsWith('http')) {
                  href = '/' + href
                }
                
                // 如果是外部链接，直接使用
                if (href.startsWith('http')) {
                  return (
                    <a 
                      key={item.id}
                      href={href}
                      className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      target={item.target || '_self'}
                    >
                      {item.name}
                    </a>
                  )
                }
                
                // 内部链接添加语言前缀
                return (
                  <Link 
                    key={item.id}
                    href={`/${locale}${href}`}
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
          
          {/* 右侧操作区域 */}
          <div className="hidden md:flex items-center space-x-4">
            {/* 添加搜索框 */}
            <div className="w-48">
              <SearchBox />
            </div>
            
            {/* 语言切换器 */}
            <div className="relative ml-3">
              <select
                value={locale}
                onChange={handleLanguageChange}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-3 text-sm"
              >
                {availableLocales.map((loc) => (
                  <option key={loc.code} value={loc.code}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* 移动端菜单按钮 */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">打开菜单</span>
              {/* 菜单图标 */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* 关闭图标 */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* 移动端菜单 */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {menuItems.map(item => {
            // 处理链接
            let href = item.href
            if (!href.startsWith('/') && !href.startsWith('http')) {
              href = '/' + href
            }
            
            return (
              <Link 
                key={item.id}
                href={`/${locale}${href}`}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
                onClick={() => setIsMenuOpen(false)}
                target={item.target || '_self'}
              >
                {item.name}
              </Link>
            )
          })}
        </div>
        
        {/* 在移动端菜单中也添加搜索框 */}
        <div className="px-4 py-2">
          <SearchBox />
        </div>
        
        {/* 在移动端菜单中也添加语言切换器 */}
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <span className="text-sm font-medium text-gray-500">语言</span>
            </div>
            <div className="ml-3">
              <div className="relative ml-3">
                <select
                  value={locale}
                  onChange={handleLanguageChange}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-3 text-sm"
                >
                  {availableLocales.map((loc) => (
                    <option key={loc.code} value={loc.code}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 