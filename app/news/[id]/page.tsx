// @ts-nocheck
import { fetchNewsItemById } from '@/lib/api';
import { redirect } from 'next/navigation';

export default async function NewsDetailPage({ params }: any) {
  // 由于此路径没有 locale 参数，我们需要重定向到带有默认语言的路径
  // 或者使用默认语言获取数据
  
  // 方法1: 重定向到带有默认语言的路径
  redirect(`/zh/news/${params.id}`);
  
  // 方法2: 使用默认语言获取数据
  /*
  const newsItem = await fetchNewsItemById('zh', params.id);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {newsItem ? (
          <>
            <h1 className="text-3xl font-bold mb-4">{newsItem.title}</h1>
            <p className="text-gray-500 mb-8">
              {new Date(newsItem.date).toLocaleDateString('zh-CN')}
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
              新闻未找到
            </h1>
          </div>
        )}
      </div>
    </div>
  );
  */
}

// 简化 generateStaticParams 函数
export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' }
  ];
} 