import { Metadata } from 'next';
import { fetchContactInfo, fetchSupportedLocales } from '@/lib/api';
import { ContactForm } from '@/components/ContactForm';
import { commonRevalidate } from '@/lib/pageWrapper';

// 生成元数据
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { locale } = params;
  
  return {
    title: locale === 'en' ? 'Contact Us' : '联系我们',
    description: locale === 'en' 
      ? 'Get in touch with our team for inquiries and support' 
      : '联系我们的团队获取咨询和支持'
  };
}

// 静态生成所有语言版本
export async function generateStaticParams() {
  const locales = await fetchSupportedLocales();
  return locales.map(locale => ({ locale: locale.code }));
}

// 联系页面
export default async function ContactPage({ params }: any) {
  const contactInfo = await fetchContactInfo(params.locale);
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {params.locale === 'en' ? 'Contact Us' : '联系我们'}
      </h1>
      
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* 联系信息 */}
          <div>
            <h2 className="text-xl font-bold mb-6">
              {params.locale === 'en' ? 'Our Information' : '联系方式'}
            </h2>
            
            <div className="space-y-4">
              {contactInfo.address && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="ml-3 text-gray-700">
                    <p className="font-medium">
                      {params.locale === 'en' ? 'Address' : '地址'}
                    </p>
                    <p>{contactInfo.address}</p>
                  </div>
                </div>
              )}
              
              {contactInfo.phone && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="ml-3 text-gray-700">
                    <p className="font-medium">
                      {params.locale === 'en' ? 'Phone' : '电话'}
                    </p>
                    <p>{contactInfo.phone}</p>
                  </div>
                </div>
              )}
              
              {contactInfo.email && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-3 text-gray-700">
                    <p className="font-medium">
                      {params.locale === 'en' ? 'Email' : '邮箱'}
                    </p>
                    <p>{contactInfo.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* 联系表单 */}
          <div>
            <h2 className="text-xl font-bold mb-6">
              {params.locale === 'en' ? 'Send Us a Message' : '给我们留言'}
            </h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}

// 设置页面重新验证时间
export const revalidate = 3600; // 1小时 