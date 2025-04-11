import '../globals.css'
import { Inter } from 'next/font/google'
import { fetchGlobalInfo, fetchMenuItems, fetchSupportedLocales } from '@/lib/api'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BackToTop } from '@/components/BackToTop'
import { PageTransition } from '@/components/PageTransition'
import { LocaleProvider } from '@/contexts/LocaleContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '企业网站模板',
  description: '使用 Next.js 和 Tailwind CSS 构建的企业网站模板',
}

// 设置页面重新验证时间
export const revalidate = 60; // 60秒

// 定义支持的语言
export async function generateStaticParams() {
  const locales = await fetchSupportedLocales();
  // 返回正确格式的对象数组，每个对象包含一个 locale 字符串
  return locales.map(locale => ({ locale: locale.code }));
}

export default async function LocaleLayout({
  children,
  params,
}: any) {
  try {
    // 获取当前语言
    const locale = params.locale;
    
    // 获取全局信息，包括翻译数据
    let globalInfo;
    try {
      globalInfo = await fetchGlobalInfo(locale);
    } catch (error) {
      console.error(`Error fetching global info for locale ${locale}:`, error);
      // 使用默认值
      globalInfo = {
        siteName: '企业网站模板',
        logo: '/logo.png',
        translations: {},
        locale,
        footer: {
          copyright: '',
          links: [],
          socialMedia: []
        },
        contactInfo: {
          address: '',
          phone: '',
          email: ''
        }
      };
    }
    
    // 获取菜单数据
    let menuItems;
    try {
      menuItems = await fetchMenuItems(locale);
    } catch (error) {
      console.error(`Error fetching menu items for locale ${locale}:`, error);
      // 使用默认菜单
      menuItems = [];
    }
    
    // 获取支持的语言列表
    let supportedLocales;
    try {
      supportedLocales = await fetchSupportedLocales();
    } catch (error) {
      console.error('Error fetching supported locales:', error);
      // 使用默认语言列表
      supportedLocales = [
        { code: 'zh', name: '中文' },
        { code: 'en', name: 'English' }
      ];
    }
    
    return (
      <html lang={params.locale}>
        <body className={inter.className}>
          <LocaleProvider 
            initialLocale={locale} 
            availableLocales={supportedLocales}
            initialTranslations={globalInfo.translations}
          >
            <Header 
              siteName={globalInfo.siteName} 
              logo={globalInfo.logo}
              menuItems={menuItems}
            />
            <PageTransition>
              <main>{children}</main>
            </PageTransition>
            <Footer 
              copyright={globalInfo.footer.copyright}
              links={globalInfo.footer.links}
              socialMedia={globalInfo.footer.socialMedia}
              contactInfo={globalInfo.contactInfo}
            />
            <BackToTop />
          </LocaleProvider>
        </body>
      </html>
    );
  } catch (error) {
    console.error('Error in LocaleLayout:', error);
    // 返回一个简单的错误页面
    return (
      <html>
        <body>
          <h1>Something went wrong</h1>
          <p>Please try again later</p>
        </body>
      </html>
    );
  }
} 