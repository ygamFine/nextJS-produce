import { Metadata } from 'next';
import { fetchAboutData, fetchSupportedLocales } from '@/lib/api';
import { OptimizedImage } from '@/components/OptimizedImage';

// 定义页面参数类型
type PageParams = {
  params: {
    locale: string;
  };
};

// 生成元数据
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { locale } = params;
  const aboutData = await fetchAboutData(locale);
  
  return {
    title: aboutData.title || (locale === 'en' ? 'About Us' : '关于我们'),
    description: aboutData.title || (locale === 'en' ? 'Learn more about our company' : '了解更多关于我们公司的信息')
  };
}

// 静态生成所有语言版本
export async function generateStaticParams() {
  const locales = await fetchSupportedLocales();
  return locales.map(locale => ({ locale: locale.code }));
}

// 关于页面
export default async function AboutPage({ params }: any) {
  const { locale } = params;
  
  // 获取关于我们页面数据
  const aboutData = await fetchAboutData(locale);
  
  // 确保内容是字符串
  const safeContent = typeof aboutData.content === 'string' 
    ? aboutData.content 
    : '';
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {aboutData.title || (locale === 'en' ? 'About Us' : '关于我们')}
        </h1>
        
        {aboutData.image && (
          <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
            <OptimizedImage
              src={aboutData.image}
              alt={aboutData.title || ''}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        
        <div className="prose prose-lg max-w-none">
          {safeContent ? (
            <div dangerouslySetInnerHTML={{ __html: safeContent }} />
          ) : (
            <p>
              {locale === 'en' 
                ? 'Content not available. Please check back later.' 
                : '内容不可用。请稍后再查看。'
              }
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// 设置页面重新验证时间
export const revalidate = 60; // 60秒