import { Metadata } from 'next'
import Link from 'next/link'
import { fetchHomePageData, fetchGlobalInfo, fetchSupportedLocales, fetchProducts } from '@/lib/api'
import { BannerCarouselClient } from '@/components/BannerCarouselClient'
import { OptimizedImage } from '@/components/OptimizedImage'

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
  return locales.map(locale => ({ locale: locale.code }));
}

// 服务器组件
export default async function HomePage({ params }: any ) {
  const { locale } = params;
  
  // 获取完整的首页数据，包括 banners 和 about 部分
  const homeData = await fetchHomePageData(locale);
  const { banners, about } = homeData;
  
  // 获取产品列表，限制为6个
  const allProducts = await fetchProducts(locale);
  const featuredProducts = allProducts.slice(0, 6);
  
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
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map(product => (
                <Link 
                  href={`/${params.locale}/products/${product.id}`} 
                  key={product.id}
                  className="group"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                    <div className="relative h-64 overflow-hidden">
                      <OptimizedImage 
                        src={product.image} 
                        alt={product.name} 
                        fill
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-600 transition">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <p className="text-lg font-bold text-indigo-600">
                        ¥{product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {params.locale === 'en' ? 'No products available at the moment.' : '暂时没有可用的产品。'}
              </p>
            </div>
          )}
          
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
                <OptimizedImage 
                  src={about.image} 
                  alt={about.title} 
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* 最新新闻部分 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {params.locale === 'en' ? 'Latest News' : '最新动态'}
          </h2>
          
          {/* 这里可以添加新闻列表，类似产品列表的实现 */}
          
          <div className="text-center mt-8">
            <Link href={`/${params.locale}/news`}>
              <span className="inline-block border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-medium py-2 px-6 rounded-md transition">
                {params.locale === 'en' ? 'View All News' : '查看全部新闻'}
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

// 设置页面重新验证时间
export const revalidate = 3600; // 1小时 