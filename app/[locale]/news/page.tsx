import { Metadata } from 'next';
import Link from 'next/link';
import { fetchNewsItems } from '@/lib/api';
import { OptimizedImage } from '@/components/OptimizedImage';
import { formatDate } from '@/lib/utils';

// 使用 any 类型替代 LocalePageProps
type PageParams = {
  params: {
    locale: string;
  };
  searchParams?: Record<string, string | string[] | undefined>;
};

// 生成元数据
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: locale === 'en' ? 'News & Updates' : '新闻动态',
    description: locale === 'en' 
      ? 'Latest news, updates and articles' 
      : '最新新闻、更新和文章'
  };
}

// 新闻列表页面
export default async function NewsPage({ params }: any) {
  const { locale } = params;
  
  let newsItems = [];
  
  try {
    // 获取新闻列表
    newsItems = await fetchNewsItems(locale);
  } catch (error) {
    console.error('Error fetching news items:', error);
    // 继续渲染页面，但显示空列表
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {locale === 'en' ? 'News & Updates' : '新闻动态'}
      </h1>
      
      {/* 新闻列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {newsItems.map(news => (
          <div key={news.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Link href={`/${locale}/news/${news.id}`}>
              <div className="relative h-48">
                <OptimizedImage
                  src={news.image || '/placeholder-news.jpg'}
                  alt={news.title || ''}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
            <div className="p-4">
              <p className="text-gray-500 text-sm mb-2">
                {news.date && formatDate(news.date, locale)}
              </p>
              <Link href={`/${locale}/news/${news.id}`}>
                <h3 className="text-xl font-semibold mb-2 hover:text-indigo-600 transition-colors">
                  {news.title || ''}
                </h3>
              </Link>
              {news.summary && (
                <p className="text-gray-600 line-clamp-3">
                  {news.summary}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {newsItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {locale === 'en' ? 'No news items found' : '暂无新闻'}
          </p>
        </div>
      )}
    </div>
  );
}

// 设置页面重新验证时间
export const revalidate = 60; // 60秒