import { Metadata } from 'next';
import Link from 'next/link';
import { fetchCases, fetchSupportedLocales } from '@/lib/api';
import { commonRevalidate } from '@/lib/pageWrapper';

// 生成元数据
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: locale === 'en' ? 'Case Studies' : '案例展示',
    description: locale === 'en' 
      ? 'Explore our successful case studies and projects' 
      : '探索我们成功的案例和项目'
  };
}

// 静态生成所有语言版本
export async function generateStaticParams() {
  const locales = await fetchSupportedLocales();
  return locales.map(locale => ({ locale: locale.code }));
}

// 案例列表页面
export default async function CasesPage({ params }: any) {
  const cases = await fetchCases(params.locale);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {params.locale === 'en' ? 'Case Studies' : '案例展示'}
      </h1>
      
      {cases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map(item => (
            <Link 
              href={`/${params.locale}/cases/${item.id}`} 
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
            {params.locale === 'en' ? 'No case studies found' : '没有找到案例'}
          </p>
        </div>
      )}
    </div>
  );
}

// 设置页面重新验证时间
export const revalidate = 60; // 60秒