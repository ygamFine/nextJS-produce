// @ts-nocheck
import { fetchNewsItems, fetchSupportedLocales } from '@/lib/api';
import Link from 'next/link';

export default async function NewsPage({ params }: any) {
  const newsItems = await fetchNewsItems(params.locale);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {params.locale === 'en' ? 'News & Updates' : '新闻动态'}
      </h1>
      
      {newsItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map(item => (
            <Link 
              href={`/${params.locale}/news/${item.id}`} 
              key={item.id}
              className="group"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-6">
                  <p className="text-gray-500 text-sm mb-2">
                    {new Date(item.date).toLocaleDateString(
                      params.locale === 'en' ? 'en-US' : 'zh-CN'
                    )}
                  </p>
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-indigo-600 transition">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 line-clamp-3">
                    {item.summary}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {params.locale === 'en' ? 'No news items found' : '没有找到新闻'}
          </p>
        </div>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  const locales = await fetchSupportedLocales();
  return locales.map(locale => ({ locale: locale.code }));
} 