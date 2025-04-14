import { MetadataRoute } from 'next';
import { fetchProducts, fetchNewsItems, fetchCases, fetchSupportedLocales } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // 获取支持的语言
    const locales = await fetchSupportedLocales();
    const localeCodes = locales.map(locale => locale.code);
    
    // 基础 URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
    
    // 创建站点地图条目
    const entries: MetadataRoute.Sitemap = [];
    
    // 添加首页和基础页面
    for (const locale of localeCodes) {
      // 首页
      entries.push({
        url: `${baseUrl}/${locale}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      });
      
      // 关于页面
      entries.push({
        url: `${baseUrl}/${locale}/about`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
      
      // 联系页面
      entries.push({
        url: `${baseUrl}/${locale}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
      
      // 搜索页面
      entries.push({
        url: `${baseUrl}/${locale}/search`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
      
      // 站点地图页面
      entries.push({
        url: `${baseUrl}/${locale}/sitemap`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      });
      
      // 获取产品数据
      const products = await fetchProducts(locale);
      
      // 添加产品列表页
      entries.push({
        url: `${baseUrl}/${locale}/products`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      });
      
      // 添加产品详情页
      for (const product of products) {
        entries.push({
          url: `${baseUrl}/${locale}/products/${product.id}`,
          lastModified: new Date(product.updatedAt || Date.now()),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
      
      // 获取新闻数据
      const newsItems = await fetchNewsItems(locale);
      
      // 添加新闻列表页
      entries.push({
        url: `${baseUrl}/${locale}/news`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      });
      
      // 添加新闻详情页
      for (const newsItem of newsItems) {
        entries.push({
          url: `${baseUrl}/${locale}/news/${newsItem.id}`,
          lastModified: new Date(newsItem.date || Date.now()),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
      
      // 获取案例数据
      const cases = await fetchCases(locale);
      
      // 添加案例列表页
      entries.push({
        url: `${baseUrl}/${locale}/cases`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
      
      // 添加案例详情页
      for (const caseItem of cases) {
        entries.push({
          url: `${baseUrl}/${locale}/cases/${caseItem.id}`,
          lastModified: new Date(caseItem.date || Date.now()),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    }
    
    return entries;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // 返回一个基本的站点地图，确保至少有一些内容
    return [
      {
        url: 'https://example.com',
        lastModified: new Date(),
      },
    ];
  }
} 