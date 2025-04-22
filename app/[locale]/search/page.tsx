import { Suspense } from 'react';
import SearchClient from './SearchClient';
import { Metadata } from 'next';
// import { ErrorBoundary } from 'react-error-boundary';

// 生成元数据
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: locale === 'en' ? 'Search Results' : '搜索结果',
    description: locale === 'en' 
      ? 'Search for products, news, and case studies' 
      : '搜索产品、新闻和案例研究'
  };
}

// 静态生成参数
export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'zh' },
    { locale: 'ja' },
    { locale: 'asa' },
    { locale: 'ar' },
    { locale: 'my' }
  ];
}

// 服务器组件搜索页面
export default function SearchPage({ params }: any) {
  return (
    <div className="container mx-auto px-4 py-12">
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      }>
        <ErrorBoundary fallback={
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">
              {params.locale === 'en' ? 'Search' : '搜索'}
            </h1>
            <p className="text-gray-600">
              {params.locale === 'en' 
                ? 'Sorry, the search function is currently unavailable.' 
                : '抱歉，搜索功能暂时不可用。'}
            </p>
          </div>
        }>
          <SearchClient locale={params.locale} />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}

// 简单的错误边界组件
function ErrorBoundary({ children, fallback }: { children: React.ReactNode, fallback: React.ReactNode }) {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('Search error:', error);
    return <>{fallback}</>;
  }
} 