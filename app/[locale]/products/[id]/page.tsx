import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 从 API 导入函数
import { fetchProducts } from '@/lib/api';
import { AnyARecord } from 'node:dns';

// 简单的价格格式化函数
function formatPrice(price: number, locale: string) {
  const currencySymbol = locale === 'en' ? '$' : '¥';
  return `${currencySymbol}${price.toFixed(2)}`;
}

// 生成元数据
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { locale, id } = params;
  
  try {
    // 获取所有产品
    const products = await fetchProducts(locale);
    
    // 查找当前产品
    const product = products.find(p => p.id.toString() === id);
    
    if (!product) {
      return {
        title: locale === 'en' ? 'Product Not Found' : '产品未找到',
      };
    }
    
    return {
      title: product.title || product.name || 'Product',
      description: product.description 
        ? (product.description.length > 160 
            ? product.description.substring(0, 157) + '...' 
            : product.description)
        : (locale === 'en' ? 'Product details' : '产品详情'),
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: locale === 'en' ? 'Product' : '产品',
      description: locale === 'en' ? 'Product details' : '产品详情',
    };
  }
}

// 静态生成所有产品页面
export async function generateStaticParams() {
  try {
    // 获取所有支持的语言的所有产品
    const locales = ['zh', 'en', 'ja', 'asa'];
    const params = [];
    
    for (const locale of locales) {
      try {
        const products = await fetchProducts(locale);
        const productParams = products.map(product => ({
          locale,
          id: product.id.toString(),
        }));
        params.push(...productParams);
      } catch (error) {
        console.error(`Error fetching products for locale ${locale}:`, error);
      }
    }
    
    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// 产品详情页面
export default async function ProductPage({ params }: any) {
  const { locale, id } = params;
  
  try {
    // 获取所有产品
    const products = await fetchProducts(locale);
    
    // 查找当前产品
    const product = products.find(p => p.id.toString() === id);
    
    // 如果产品不存在，显示404页面
    if (!product) {
      notFound();
    }
    
    // 安全处理可能为空的字段
    const productName = product.title || product.name || (locale === 'en' ? 'Unnamed Product' : '未命名产品');
    const productDescription = product.description || '';
    const productPrice = product.price || 0;
    const productImage = product.image || '/placeholder.jpg';
    
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* 面包屑导航 */}
          <div className="mb-6">
            <nav className="text-sm">
              <Link href={`/${locale}`} className="text-gray-500 hover:text-gray-700">
                {locale === 'en' ? 'Home' : '首页'}
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <Link href={`/${locale}/products`} className="text-gray-500 hover:text-gray-700">
                {locale === 'en' ? 'Products' : '产品'}
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-900">{productName}</span>
            </nav>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* 产品图片 */}
            <div className="relative h-96 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={productImage}
                alt={productName}
                fill
                className="object-contain"
                priority
              />
            </div>
            
            {/* 产品信息 */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{productName}</h1>
              <p className="text-2xl font-semibold text-indigo-600 mb-6">
                {formatPrice(productPrice, locale)}
              </p>
              
              <div className="prose mb-8">
                <p>{productDescription}</p>
              </div>
              
              {/* 简单的按钮 */}
              <button 
                className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
              >
                {locale === 'en' ? 'Add to Cart' : '加入购物车'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering product page:', error);
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center text-red-600">
          {locale === 'en' ? 'Error Loading Product' : '加载产品时出错'}
        </h1>
        <p className="text-center">
          {locale === 'en' 
            ? 'There was an error loading this product. Please try again later.' 
            : '加载此产品时出错。请稍后再试。'}
        </p>
        <div className="text-center mt-8">
          <Link href={`/${locale}/products`} className="text-indigo-600 hover:underline">
            {locale === 'en' ? 'Back to Products' : '返回产品列表'}
          </Link>
        </div>
      </div>
    );
  }
}

// 设置页面重新验证时间
export const revalidate = 60; // 60秒