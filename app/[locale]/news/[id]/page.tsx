// @ts-nocheck
import { fetchNewsItemById, fetchSupportedLocales } from '@/lib/api';

export default async function NewsDetailPage({ params }: any) {
  const newsItem = await fetchNewsItemById(params.locale, params.id);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {newsItem ? (
          <>
            <h1 className="text-3xl font-bold mb-4">{newsItem.title}</h1>
            <p className="text-gray-500 mb-8">
              {new Date(newsItem.date).toLocaleDateString(
                params.locale === 'en' ? 'en-US' : 'zh-CN'
              )}
            </p>
            
            {newsItem.image && (
              <div className="mb-8">
                <img 
                  src={newsItem.image} 
                  alt={newsItem.title} 
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}
            
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: newsItem.content }} />
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h1 className="text-2xl font-medium text-gray-900">
              {params.locale === 'en' ? 'News item not found' : '新闻未找到'}
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const locales = await fetchSupportedLocales();
  // 这里我们只生成语言路径，新闻ID将通过ISR动态生成
  return locales.map(locale => ({ 
    locale: locale.code,
    id: 'placeholder' // 这个值会被忽略，但需要提供一个占位符
  }));
} 