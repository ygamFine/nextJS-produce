import { Metadata } from 'next';
import Link from 'next/link';
import { fetchSupportedLocales, fetchProducts, fetchNewsItems, fetchCases } from '@/lib/api';

// 生成元数据
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: locale === 'en' ? 'Sitemap' : '站点地图',
    description: locale === 'en' 
      ? 'Complete sitemap of our website' 
      : '我们网站的完整站点地图'
  };
}

// 静态生成所有语言版本
export async function generateStaticParams() {
  const locales = await fetchSupportedLocales();
  return locales.map(locale => ({ locale: locale.code }));
}

// 站点地图页面
export default async function SitemapPage({ params }: any) {
  const { locale } = params;
  
  // 获取数据
  const products = await fetchProducts(locale);
  const newsItems = await fetchNewsItems(locale);
  const cases = await fetchCases(locale);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {locale === 'en' ? 'Sitemap' : '站点地图'}
      </h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            {locale === 'en' ? 'Main Pages' : '主要页面'}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li>
              <Link href={`/${locale}`} className="text-indigo-600 hover:underline">
                {locale === 'en' ? 'Home' : '首页'}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/about`} className="text-indigo-600 hover:underline">
                {locale === 'en' ? 'About Us' : '关于我们'}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/contact`} className="text-indigo-600 hover:underline">
                {locale === 'en' ? 'Contact' : '联系我们'}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/search`} className="text-indigo-600 hover:underline">
                {locale === 'en' ? 'Search' : '搜索'}
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            {locale === 'en' ? 'Products' : '产品'}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li>
              <Link href={`/${locale}/products`} className="text-indigo-600 hover:underline">
                {locale === 'en' ? 'All Products' : '所有产品'}
              </Link>
            </li>
            {products.map(product => (
              <li key={product.id}>
                <Link href={`/${locale}/products/${product.id}`} className="text-indigo-600 hover:underline">
                  {product.title || product.name || (locale === 'en' ? `Product ${product.id}` : `产品 ${product.id}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            {locale === 'en' ? 'News' : '新闻'}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li>
              <Link href={`/${locale}/news`} className="text-indigo-600 hover:underline">
                {locale === 'en' ? 'All News' : '所有新闻'}
              </Link>
            </li>
            {newsItems.map(newsItem => (
              <li key={newsItem.id}>
                <Link href={`/${locale}/news/${newsItem.id}`} className="text-indigo-600 hover:underline">
                  {newsItem.title || (locale === 'en' ? `News ${newsItem.id}` : `新闻 ${newsItem.id}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            {locale === 'en' ? 'Cases' : '案例'}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li>
              <Link href={`/${locale}/cases`} className="text-indigo-600 hover:underline">
                {locale === 'en' ? 'All Cases' : '所有案例'}
              </Link>
            </li>
            {cases.map(caseItem => (
              <li key={caseItem.id}>
                <Link href={`/${locale}/cases/${caseItem.id}`} className="text-indigo-600 hover:underline">
                  {caseItem.title || (locale === 'en' ? `Case ${caseItem.id}` : `案例 ${caseItem.id}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            {locale === 'en' ? 'Other Languages' : '其他语言'}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {locale !== 'zh' && (
              <li>
                <Link href="/zh/sitemap" className="text-indigo-600 hover:underline">
                  中文站点地图
                </Link>
              </li>
            )}
            {locale !== 'en' && (
              <li>
                <Link href="/en/sitemap" className="text-indigo-600 hover:underline">
                  English Sitemap
                </Link>
              </li>
            )}
            {locale !== 'ja' && (
              <li>
                <Link href="/ja/sitemap" className="text-indigo-600 hover:underline">
                  日本語サイトマップ
                </Link>
              </li>
            )}
            {locale !== 'asa' && (
              <li>
                <Link href="/asa/sitemap" className="text-indigo-600 hover:underline">
                  ASA Sitemap
                </Link>
              </li>
            )}
            {locale !== 'ar' && (
              <li>
                <Link href="/ar/sitemap" className="text-indigo-600 hover:underline">
                  Arabic Sitemap
                </Link>
              </li> 
            )}
            {locale !== 'my' && (
              <li>
                <Link href="/my/sitemap" className="text-indigo-600 hover:underline">
                  Malay Sitemap
                </Link> 
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

// 设置页面重新验证时间
export const revalidate = 60; // 60秒 