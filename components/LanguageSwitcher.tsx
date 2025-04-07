'use client'
import { useLocale } from '@/contexts/LocaleContext'
import { switchLanguage } from '@/lib/languageUtils'
import { usePathname } from 'next/navigation'

export function LanguageSwitcher() {
  const { locale, setLocale, availableLocales } = useLocale()
  const pathname = usePathname()
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value
    
    // 使用 setLocale 函数切换语言
    setLocale(newLocale)
  }
  
  return (
    <div className="relative">
      <select
        value={locale}
        onChange={handleChange}
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-3 text-sm"
      >
        {availableLocales.map((loc) => (
          <option key={loc.code} value={loc.code}>
            {loc.name}
          </option>
        ))}
      </select>
    </div>
  )
} 