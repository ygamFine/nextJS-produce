import { Metadata } from 'next';
import { fetchAboutPageData, fetchSupportedLocales } from '@/lib/api';
import { commonRevalidate } from '@/lib/pageWrapper';

// 生成元数据
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: locale === 'en' ? 'About Us' : '关于我们',
    description: locale === 'en' 
      ? 'Learn more about our company and our mission' 
      : '了解更多关于我们公司和使命的信息'
  };
}

// 静态生成所有语言版本
export async function generateStaticParams() {
  const locales = await fetchSupportedLocales();
  return locales.map(locale => ({ locale: locale.code }));
}

// 关于页面
export default async function AboutPage({ params }: any) {
  const aboutData = await fetchAboutPageData(params.locale);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {params.locale === 'en' ? 'About Us' : '关于我们'}
      </h1>
      
      <div className="max-w-4xl mx-auto">
        {aboutData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <img 
                src={aboutData.image} 
                alt={aboutData.title} 
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">{aboutData.title}</h2>
              <div 
                className="prose prose-lg" 
                dangerouslySetInnerHTML={{ __html: aboutData.content }} 
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {params.locale === 'en' 
                ? 'Content is being updated. Please check back later.' 
                : '内容正在更新中，请稍后再查看。'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// 设置页面重新验证时间
export const revalidate = 3600; // 1小时 