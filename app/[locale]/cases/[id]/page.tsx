// @ts-nocheck
import { fetchCaseById, fetchSupportedLocales } from '@/lib/api';

export default async function CaseDetailPage({ params }: any) {
  const caseItem = await fetchCaseById(params.locale, params.id);
  
  // 使用 API 获取的数据，如果没有则使用默认数据
  const caseDetail = caseItem || {
    title: '案例标题',
    description: '案例详细描述...',
    challenge: '项目挑战...',
    solution: '解决方案...',
    result: '项目成果...',
    image: '/images/case1.jpg',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">{caseDetail.title}</h1>
      <img
        src={caseDetail.image}
        alt={caseDetail.title}
        className="w-full max-h-96 object-cover rounded-lg shadow-lg mb-8"
      />
      <div className="prose max-w-none">
        <p className="mb-6">{caseDetail.description}</p>
        
        <h2 className="text-2xl font-bold mb-4">项目挑战</h2>
        <p className="mb-6">{caseDetail.challenge}</p>
        
        <h2 className="text-2xl font-bold mb-4">解决方案</h2>
        <p className="mb-6">{caseDetail.solution}</p>
        
        <h2 className="text-2xl font-bold mb-4">项目成果</h2>
        <p>{caseDetail.result}</p>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const locales = await fetchSupportedLocales();
  return locales.map(locale => ({ 
    locale: locale.code,
    id: 'placeholder'
  }));
}

export const revalidate = 3600; // 每小时重新验证一次 