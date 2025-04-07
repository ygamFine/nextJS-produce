'use client'
import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

type LocaleContextType = {
  locale: string
  setLocale: (locale: string) => void
  t: (key: string, fallback?: string) => string
  availableLocales: Array<{code: string, name: string}>
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

// 创建一个全局缓存对象，用于存储所有语言的翻译
const translationsCache: Record<string, Record<string, string>> = {}

export const LocaleProvider: React.FC<{
  children: React.ReactNode
  initialLocale: string
  availableLocales: Array<{code: string, name: string}>
  initialTranslations: Record<string, string>
}> = ({ children, initialLocale, availableLocales, initialTranslations }) => {
  const [locale, setLocaleState] = useState(initialLocale)
  const [translations, setTranslations] = useState(initialTranslations || {})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [pendingLocale, setPendingLocale] = useState<string | null>(null)
  
  // 初始化缓存 - 不再预加载本地 JSON 文件
  useEffect(() => {
    if (initialTranslations) {
      translationsCache[initialLocale] = initialTranslations
    }
    setMounted(true)
    
    // 不再预加载本地 JSON 文件
    // 所有翻译数据将从 Strapi 获取
  }, [initialLocale, initialTranslations])
  
  // 翻译函数
  const t = (key: string, fallback = '') => {
    if (!translations) return fallback || key
    return translations[key] || fallback || key
  }
  
  // 设置语言并处理路由变化
  const setLocale = (newLocale: string) => {
    if (!mounted || isLoading) return
    
    const availableLocaleCodes = availableLocales.map(loc => loc.code)
    
    if (availableLocaleCodes.includes(newLocale) && newLocale !== locale) {
      // 打开确认对话框
      setPendingLocale(newLocale);
      setIsDialogOpen(true);
    }
  }
  
  // 提取语言切换的后续步骤为一个函数
  function continueLanguageSwitch(newLocale: string) {
    if (!mounted || isLoading) return
    
    setIsLoading(true)
    
    // 更新状态
    setLocaleState(newLocale)
    
    // 保存用户偏好
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLocale', newLocale)
    }
    
    // 获取当前路径，不包括语言前缀
    let currentPath = pathname || '/'
    let pathWithoutLocale = currentPath
    
    // 检查当前路径是否以语言代码开头
    const localePattern = /^\/[a-z]{2}(\/|$)/
    
    if (localePattern.test(currentPath)) {
      pathWithoutLocale = currentPath.substring(3) || '/'
    }
    
    // 构建新路径
    const newPath = pathWithoutLocale === '/' 
      ? `/${newLocale}` 
      : `/${newLocale}${pathWithoutLocale}`
    
    // 关闭对话框
    setIsDialogOpen(false)
    setPendingLocale(null)
    
    // 使用 window.location.href 进行导航，避免 Next.js 路由器的重定向循环
    if (typeof window !== 'undefined') {
      // 设置一个短暂的延迟，确保状态更新
      setTimeout(() => {
        window.location.href = newPath
        setIsLoading(false)
      }, 100)
    } else {
      // 在服务器端，使用 router.replace
      router.replace(newPath)
      setIsLoading(false)
    }
  }
  
  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, availableLocales }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
      
      {/* 使用原生 dialog 元素替代 Headless UI 的 Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" onClick={() => setIsDialogOpen(false)} />
            
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {t('language.switch.title', '切换语言')}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {t('language.switch.message', '您确定要切换语言吗？页面将会重新加载。')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => continueLanguageSwitch(pendingLocale || locale)}
                >
                  {t('language.switch.confirm', '确认')}
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setIsDialogOpen(false)}
                >
                  {t('language.switch.cancel', '取消')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </LocaleContext.Provider>
  )
}

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
} 