import { Metadata } from 'next';
import Link from 'next/link';
import { fetchProducts, fetchSupportedLocales } from '@/lib/api';
import { commonRevalidate } from '@/lib/pageWrapper';

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
  const products = await fetchProducts(params.locale);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {params.locale === 'en' ? 'Our Products' : '我们的产品'}
      </h1>
      
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <Link 
              href={`/${params.locale}/products/${product.id}`} 
              key={product.id}
              className="group"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-indigo-600 transition">
                    {product.name}
                  </h2>
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
        <div className="text-center py-12">
          <p className="text-gray-500">
            {params.locale === 'en' ? 'No products found' : '没有找到产品'}
          </p>
        </div>
      )}
    </div>
  );
}

// 设置页面重新验证时间
export const revalidate = 3600; // 1小时 