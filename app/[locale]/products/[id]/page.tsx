// @ts-nocheck
import { fetchProductById, fetchSupportedLocales } from '@/lib/api'

// 使用 generateStaticParams 进行静态生成
export async function generateStaticParams() {
  const locales = await fetchSupportedLocales()
  // 这里我们只生成语言路径，产品ID将通过ISR动态生成
  return locales.map(locale => ({ 
    locale: locale.code,
    id: 'placeholder' // 这个值会被忽略，但需要提供一个占位符
  }))
}

export default async function ProductDetailPage({ params }: any) {
  const product = await fetchProductById(params.locale, params.id)
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {product ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-96 overflow-hidden rounded-lg">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-2xl text-indigo-600 font-semibold mb-6">
                ¥{product.price.toFixed(2)}
              </p>
              <div className="prose prose-lg mb-8">
                <p>{product.description}</p>
              </div>
              
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-md transition">
                {params.locale === 'en' ? 'Add to Cart' : '加入购物车'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h1 className="text-2xl font-medium text-gray-900">
              {params.locale === 'en' ? 'Product not found' : '产品未找到'}
            </h1>
          </div>
        )}
      </div>
    </div>
  )
} 