import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { fetchProducts, fetchInternalLinkKeywords, processInternalLinks } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { RelatedProducts } from '@/components/RelatedProducts';

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
        : (locale === 'en' ? 'Product details' : '产品详情')
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
    const locales = ['zh', 'en', 'ja', 'asa', 'ar', 'my'];
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
    
    // 获取内链关键词
    const keywordsMap = await fetchInternalLinkKeywords(locale);
    
    // 提取产品信息
    const productName = product.title || product.name || '';
    const productDescription = product.description || '';
    const productPrice = product.price || 0;
    const productImage = product.image || '/placeholder.jpg';
    
    // 处理产品描述中的内链
    const processedDescription = processInternalLinks(
      productDescription, 
      keywordsMap,
      locale
    );
    
    // 查找相关产品
    const relatedProducts = products
      .filter(p => p.id.toString() !== id)
      .slice(0, 4); // 最多显示4个相关产品
    
    return (
      <div className="bg-white">
        <div className="container mx-auto px-4 py-12">
          {/* 面包屑导航 */}
          <nav className="mb-8">
            <ol className="flex space-x-2 text-sm text-gray-500">
              <li>
                <Link href={`/${locale}`} className="hover:text-gray-700">
                  {locale === 'en' ? 'Home' : '首页'}
                </Link>
              </li>
              <li><span className="mx-2">/</span></li>
              <li>
                <Link href={`/${locale}/products`} className="hover:text-gray-700">
                  {locale === 'en' ? 'Products' : '产品'}
                </Link>
              </li>
              <li><span className="mx-2">/</span></li>
              <li className="text-gray-900 font-medium">{productName}</li>
            </ol>
          </nav>
          
          {/* 产品详情 */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* 产品图片 */}
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <Image 
                src={productImage}
                alt={productName}
                width={600}
                height={600}
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
                <div dangerouslySetInnerHTML={{ __html: processedDescription }} />
              </div>
              
              {/* 简单的按钮 */}
              <button 
                className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
              >
                {locale === 'en' ? 'Add to Cart' : '加入购物车'}
              </button>
            </div>
          </div>
          
          {/* 相关产品 */}
          {relatedProducts.length > 0 && (
            <RelatedProducts 
              products={relatedProducts}
              locale={locale}
            />
          )}
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