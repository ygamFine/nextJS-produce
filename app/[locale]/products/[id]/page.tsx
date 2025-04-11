import { Metadata } from 'next';
import { fetchProductById, fetchProducts, fetchSupportedLocales } from '@/lib/api';
import { commonRevalidate } from '@/lib/pageWrapper';
import { OptimizedImage } from '@/components/OptimizedImage';

// 生成元数据
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { locale, id } = params;
  const product = await fetchProductById(id, locale);
  
  if (!product) {
    return {
      title: locale === 'en' ? 'Product Not Found' : '产品未找到',
      description: ''
    };
  }
  
  return {
    title: product.name,
    description: product.description.substring(0, 160)
  };
}

// 静态生成参数
export async function generateStaticParams() {
  try {
    // 获取所有支持的语言
    const locales = await fetchSupportedLocales();
    
    // 为每种语言获取产品列表
    const allParams = [];
    
    for (const locale of locales) {
      try {
        const products = await fetchProducts(locale.code);
        
        // 为每个产品生成路径参数
        const productParams = products.map(product => ({
          locale: locale.code,
          id: product.id.toString()
        }));
        
        allParams.push(...productParams);
      } catch (error) {
        console.error(`Error fetching products for locale ${locale.code}:`, error);
        // 添加一个默认产品ID，确保至少有一个路径被生成
        allParams.push({ locale: locale.code, id: '1' });
      }
    }
    
    return allParams.length > 0 ? allParams : [{ locale: 'zh', id: '1' }];
  } catch (error) {
    console.error('Error generating static params:', error);
    // 返回一个安全的默认值
    return [{ locale: 'zh', id: '1' }];
  }
}

// 产品详情页面
export default async function ProductDetailPage({ params }: any) {
  const product = await fetchProductById(params.id, params.locale);
  
  return (
    <div className="container mx-auto px-4 py-12">
      {product ? (
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <OptimizedImage 
                src={product.image} 
                alt={product.name} 
                width={600}
                height={400}
                priority
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-2xl font-bold text-indigo-600 mb-6">
                ¥{product.price.toFixed(2)}
              </p>
              <div className="prose prose-lg">
                <p>{product.description}</p>
              </div>
              {product.category && (
                <div className="mt-6">
                  <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {product.category}
                  </span>
                </div>
              )}
              
              <div className="mt-8">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-md transition mr-4">
                  {params.locale === 'en' ? 'Add to Cart' : '加入购物车'}
                </button>
                <button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium py-3 px-6 rounded-md transition">
                  {params.locale === 'en' ? 'Contact Us' : '联系我们'}
                </button>
              </div>
            </div>
          </div>
          
          {/* 产品详情部分 */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">
              {params.locale === 'en' ? 'Product Details' : '产品详情'}
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            </div>
          </div>
          
          {/* 相关产品推荐部分可以在这里添加 */}
        </div>
      ) : (
        <div className="text-center py-12">
          <h1 className="text-2xl font-medium text-gray-900">
            {params.locale === 'en' ? 'Product not found' : '产品未找到'}
          </h1>
          <p className="mt-4 text-gray-500">
            {params.locale === 'en' 
              ? 'The product you are looking for does not exist or has been removed.' 
              : '您查找的产品不存在或已被移除。'
            }
          </p>
        </div>
      )}
    </div>
  );
}

// 设置页面重新验证时间
export const revalidate = 60; // 60秒