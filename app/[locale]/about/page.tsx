// @ts-nocheck
import { fetchAboutPageData, fetchSupportedLocales } from '@/lib/api';

export default async function AboutPage({ params }: any) {
  const aboutData = await fetchAboutPageData(params.locale);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {params.locale === 'en' ? 'About Us' : '关于我们'}
      </h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-lg mx-auto">
          {aboutData ? (
            <div dangerouslySetInnerHTML={{ __html: aboutData.content || '' }} />
          ) : (
            <p>{params.locale === 'en' ? 'Content is being prepared...' : '内容正在准备中...'}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const locales = await fetchSupportedLocales();
  return locales.map(locale => ({ locale: locale.code }));
}

export const revalidate = 3600; // 每小时重新验证一次 