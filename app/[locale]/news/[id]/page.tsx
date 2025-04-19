import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchNewsItemById, fetchRelatedNews } from '@/lib/api';
import { OptimizedImage } from '@/components/OptimizedImage';
import { formatDate } from '@/lib/utils';

// 使用 any 类型
type PageParams = {
  params: {
    locale: string;
    id: string;
  };
  searchParams?: Record<string, string | string[] | undefined>;
};

// 生成元数据
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { locale, id } = params;
  
  // 获取新闻详情
  const newsItem = await fetchNewsItemById(locale, id);
  
  if (!newsItem) {
    return {
      title: locale === 'en' ? 'News not found' : '新闻未找到'
    };
  }
  
  return {
    title: newsItem.title,
    description: newsItem.summary || newsItem.title,
    openGraph: {
      title: newsItem.title,
      description: newsItem.summary || newsItem.title,
      images: [
        {
          url: newsItem.image,
          width: 1200,
          height: 630,
          alt: newsItem.title
        }
      ]
    }
  };
}

// 新闻详情页面
export default async function NewsDetailPage({ params }: any) {
  const { locale, id } = params;
  
  try {
    // 获取新闻详情
    const newsItem = await fetchNewsItemById(locale, id);
    
    // 如果新闻不存在，返回 404
    if (!newsItem) {
      notFound();
    }
    
    // 确保 content 是字符串
    const safeContent = typeof newsItem.content === 'string' 
      ? newsItem.content 
      : '';
    
    // 获取相关新闻
    const relatedNews = await fetchRelatedNews(locale, id);
    
    // 结构化数据
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: newsItem.title || '',
      image: [newsItem.image || ''],
      datePublished: newsItem.date || new Date().toISOString(),
      dateModified: newsItem.date || new Date().toISOString(),
      author: {
        '@type': 'Person',
        name: newsItem.author || 'Staff Writer'
      },
      publisher: {
        '@type': 'Organization',
        name: locale === 'en' ? 'Your Company Name' : '您的公司名称',
        logo: {
          '@type': 'ImageObject',
          url: 'https://your-site.com/logo.png'
        }
      },
      description: newsItem.summary || ''
    };
    
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* 返回链接 */}
          <Link 
            href={`/${locale}/news`}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {locale === 'en' ? 'Back to News' : '返回新闻列表'}
          </Link>
          
          {/* 新闻标题 */}
          <h1 className="text-3xl font-bold mb-4">{newsItem.title || ''}</h1>
          
          {/* 新闻元数据 */}
          <div className="flex items-center text-gray-500 mb-6">
            {newsItem.date && (
              <span>
                {formatDate(newsItem.date, locale)}
              </span>
            )}
            {newsItem.author && (
              <>
                <span className="mx-2">•</span>
                <span>{newsItem.author}</span>
              </>
            )}
          </div>
          
          {/* 新闻图片 */}
          <div className="relative h-96 mb-8">
            <OptimizedImage
              src={newsItem.image || '/placeholder-news.jpg'}
              alt={newsItem.title || ''}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
          
          {/* 新闻内容 */}
          <div className="prose prose-lg max-w-none">
            {safeContent ? (
              <div dangerouslySetInnerHTML={{ __html: safeContent }} />
            ) : (
              <p>{locale === 'en' ? 'Content not available' : '内容不可用'}</p>
            )}
          </div>
          
          {/* 相关新闻 */}
          {relatedNews && relatedNews.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 border-b pb-2">
                {locale === 'en' ? 'Related News' : '相关新闻'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedNews.map(news => (
                  <Link 
                    key={news.id} 
                    href={`/${locale}/news/${news.id}`}
                    className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-40">
                      <OptimizedImage
                        src={news.image || '/placeholder-news.jpg'}
                        alt={news.title || ''}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-gray-500 text-sm mb-1">
                        {news.date && formatDate(news.date, locale)}
                      </p>
                      <h3 className="text-lg font-semibold line-clamp-2">
                        {news.title || ''}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering news detail page:', error);
    
    // 返回一个简单的错误页面
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-600">
            {locale === 'en' ? 'Error Loading News' : '加载新闻时出错'}
          </h1>
          <p className="mb-6">
            {locale === 'en' 
              ? 'There was a problem loading this news article.' 
              : '加载此新闻文章时出现问题。'
            }
          </p>
          <Link 
            href={`/${locale}/news`}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {locale === 'en' ? 'Back to News' : '返回新闻列表'}
          </Link>
        </div>
      </div>
    );
  }
}

// 设置页面重新验证时间
export const revalidate = 60; // 60秒