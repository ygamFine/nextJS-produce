import { Metadata } from 'next';
import { fetchProducts, fetchSupportedLocales } from '@/lib/api';
import { ClientPagination } from '@/components/ClientPagination';

// RTL 语言列表
const rtlLocales = ['ar']; // 阿拉伯语是从右到左的语言

// 生成元数据
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: locale === 'en' ? 'Our Products' : '我们的产品',
    description: locale === 'en' 
      ? 'Explore our range of products and solutions' 
      : '探索我们的产品和解决方案'
  };
}

// 静态生成所有语言版本
export async function generateStaticParams() {
  const locales = await fetchSupportedLocales();
  return locales.map(locale => ({ locale: locale.code }));
}

// 产品列表页面
export default async function ProductsPage({ params }: any) {
  const { locale } = params;
  
  // 一次性获取所有产品
  const allProducts = await fetchProducts(locale);
  
  // 确定是否是 RTL 语言
  const isRTL = rtlLocales.includes(locale);
  
  return (
    <div className={`container mx-auto px-4 py-12 ${isRTL ? 'rtl' : ''}`}>
      <h1 className="text-3xl font-bold mb-8 text-center">
        {locale === 'en' ? 'Our Products' : '我们的产品'}
      </h1>
      
      {/* 客户端分页组件 */}
      <ClientPagination products={allProducts} locale={locale} />
    </div>
  );
}

// 设置页面重新验证时间
export const revalidate = 60; // 60秒