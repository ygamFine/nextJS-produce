import { Metadata } from 'next'
import Link from 'next/link'
import { fetchHomePageData, fetchGlobalInfo, fetchSupportedLocales } from '@/lib/api'
import { BannerCarouselClient } from '@/components/BannerCarouselClient'

// 生成元数据
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const globalInfo = await fetchGlobalInfo(params.locale)
  
  return {
    title: globalInfo.siteName,
    description: params.locale === 'en' 
      ? 'Welcome to our website. Explore our products and services.'
      : '欢迎访问我们的网站。探索我们的产品和服务。',
  }
}

// 静态生成所有语言版本
export async function generateStaticParams() {
  const locales = await fetchSupportedLocales();
  return locales.map(locale => ({
    locale: locale.code
  }));
}

// 服务器组件
export default async function HomePage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  
  // 获取完整的首页数据，包括 banners 和 about 部分
  const homeData = await fetchHomePageData(locale);
  const { banners, about } = homeData;
  
  return (
    <main>
      <section className="relative">
        <BannerCarouselClient banners={banners} locale={locale} />
      </section>
      
      {/* 特色产品部分 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {params.locale === 'en' ? 'Featured Products' : '特色产品'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 产品列表 */}
          </div>
          <div className="text-center mt-12">
            <Link href={`/${params.locale}/products`}>
              <span className="inline-block border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-medium py-2 px-6 rounded-md transition">
                {params.locale === 'en' ? 'View All Products' : '查看全部产品'}
              </span>
            </Link>
          </div>
        </div>
      </section>
      
      {/* 公司简介部分 */}
      {about && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">{about.title}</h2>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: about.content }} />
                <Link href={`/${params.locale}/about`} className="inline-block mt-6 text-indigo-600 font-medium hover:underline">
                  {params.locale === 'en' ? 'Learn More' : '了解更多'}
                </Link>
              </div>
              <div>
                <img 
                  src={about.image} 
                  alt={about.title} 
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

// 设置页面重新验证时间
export const revalidate = 3600; // 每小时重新验证一次 