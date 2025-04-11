import { Metadata } from 'next';
import { fetchCaseById, fetchCases, fetchSupportedLocales } from '@/lib/api';
import { commonRevalidate } from '@/lib/pageWrapper';

// 生成元数据
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { locale, id } = params;
  const caseItem = await fetchCaseById(locale, id);
  
  if (!caseItem) {
    return {
      title: locale === 'en' ? 'Case Study Not Found' : '案例未找到',
      description: ''
    };
  }
  
  return {
    title: caseItem.title,
    description: caseItem.summary.substring(0, 160)
  };
}

// 静态生成参数
export async function generateStaticParams() {
  try {
    // 获取所有支持的语言
    const locales = await fetchSupportedLocales();
    
    // 为每种语言获取案例列表
    const allParams = [];
    
    for (const locale of locales) {
      const cases = await fetchCases(locale.code);
      
      // 为每个案例生成路径参数
      const caseParams = cases.map(item => ({
        locale: locale.code,
        id: item.id.toString()
      }));
      
      allParams.push(...caseParams);
    }
    
    return allParams;
  } catch (error) {
    console.error('Error generating static params:', error);
    // 返回一个安全的默认值
    return [{ locale: 'zh', id: '1' }];
  }
}

// 案例详情页面
export default async function CaseDetailPage({ params }: any) {
  const caseItem = await fetchCaseById(params.locale, params.id);
  
  return (
    <div className="container mx-auto px-4 py-12">
      {caseItem ? (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{caseItem.title}</h1>
          
          <p className="text-gray-500 mb-6">
            {new Date(caseItem.date).toLocaleDateString(
              params.locale === 'en' ? 'en-US' : 'zh-CN'
            )}
          </p>
          
          {caseItem.image && (
            <div className="mb-8">
              <img 
                src={caseItem.image} 
                alt={caseItem.title} 
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          )}
          
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: caseItem.content }} />
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h1 className="text-2xl font-medium text-gray-900">
            {params.locale === 'en' ? 'Case study not found' : '案例未找到'}
          </h1>
        </div>
      )}
    </div>
  );
}

// 设置页面重新验证时间
export const revalidate = 60; // 60秒