/**
 * 切换语言并导航到新路径
 * @param currentLocale 当前语言
 * @param newLocale 新语言
 * @param currentPath 当前路径
 * @param availableLocales 可用语言列表
 */
export function switchLanguage(
  currentLocale: string,
  newLocale: string,
  currentPath: string,
  availableLocales: string[]
): void {
  // 设置 cookie
  document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`
  
  // 移除当前路径中的语言前缀
  let pathWithoutLocale = currentPath
  for (const locale of availableLocales) {
    if (pathWithoutLocale === `/${locale}` || pathWithoutLocale.startsWith(`/${locale}/`)) {
      pathWithoutLocale = pathWithoutLocale.substring(locale.length + 1) || '/'
      break
    }
  }
  
  // 构建新路径
  const newPath = pathWithoutLocale === '/' 
    ? `/${newLocale}` 
    : `/${newLocale}${pathWithoutLocale}`
  
  console.log('Switching language:', {
    from: currentLocale,
    to: newLocale,
    currentPath,
    pathWithoutLocale,
    newPath
  })
  
  // 直接修改 URL 并刷新页面
  window.location.href = newPath
} 