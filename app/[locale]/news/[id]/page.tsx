import { Metadata } from 'next';
import { fetchNewsItemById, fetchNewsItems, fetchSupportedLocales } from '@/lib/api';
import { commonRevalidate } from '@/lib/pageWrapper';

// 生成元数据
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { locale, id } = params;
  const newsItem = await fetchNewsItemById(locale, id);
  
  if (!newsItem) {
    return {
      title: locale === 'en' ? 'News Not Found' : '新闻未找到',
      description: ''
    };
  }
  
  return {
    title: newsItem.title,
    description: newsItem.summary.substring(0, 160)
  };
}

// 静态生成参数
export async function generateStaticParams() {
  try {
    // 获取所有支持的语言
    const locales = await fetchSupportedLocales();
    
    // 为每种语言获取新闻列表
    const allParams = [];
    
    for (const locale of locales) {
      const newsItems = await fetchNewsItems(locale.code);
      
      // 为每个新闻生成路径参数
      const newsParams = newsItems.map(item => ({
        locale: locale.code,
        id: item.id.toString()
      }));
      
      allParams.push(...newsParams);
    }
    
    return allParams;
  } catch (error) {
    console.error('Error generating static params:', error);
    // 返回一个安全的默认值
    return [{ locale: 'zh', id: '1' }];
  }
}

// 新闻详情页面
export default async function NewsDetailPage({ params }: any) {
  const newsItem = await fetchNewsItemById(params.locale, params.id);
  
  return (
    <div className="container mx-auto px-4 py-12">
      {newsItem ? (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{newsItem.title}</h1>
          
          <p className="text-gray-500 mb-6">
            {new Date(newsItem.date).toLocaleDateString(
              params.locale === 'en' ? 'en-US' : 'zh-CN'
            )}
          </p>
          
          {newsItem.image && (
            <div className="mb-8">
              <img 
                src={newsItem.image} 
                alt={newsItem.title} 
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          )}
          
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: newsItem.content }} />
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h1 className="text-2xl font-medium text-gray-900">
            {params.locale === 'en' ? 'News not found' : '新闻未找到'}
          </h1>
        </div>
      )}
    </div>
  );
}

// 设置页面重新验证时间
export const revalidate = 3600; // 1小时 