import * as fs from 'fs';
import * as path from 'path';
import { fetchProducts, fetchNewsItems, fetchCases } from '../lib/api';

// 创建搜索索引
async function createSearchIndex() {
  try {
    console.log('Creating search index...');
    
    // 获取所有语言
    const locales = ['zh', 'en', 'ja', 'asa'];
    
    // 为每种语言创建索引
    for (const locale of locales) {
      console.log(`Creating index for locale: ${locale}`);
      
      // 获取数据，使用空数组作为默认值
      let products = [];
      let newsItems = [];
      let cases = [];
      
      try {
        products = await fetchProducts(locale);
      } catch (error) {
        console.warn(`加载产品列表失败 for ${locale}:`, error.message);
      }
      
      try {
        newsItems = await fetchNewsItems(locale);
      } catch (error) {
        console.warn(`Failed to fetch news for ${locale}:`, error.message);
      }
      
      try {
        cases = await fetchCases(locale);
      } catch (error) {
        console.warn(`Failed to fetch cases for ${locale}:`, error.message);
      }
      
      // 转换为搜索项
      const searchItems = [
        ...(Array.isArray(products) ? products : []).map(product => ({
          id: `product-${product.id || Math.random().toString(36).substring(2, 9)}`,
          title: product.name || '',
          content: product.description || '',
          type: 'product',
          url: `/${locale}/products/${product.id || ''}`,
          image: product.image || '',
          price: product.price
        })),
        ...(Array.isArray(newsItems) ? newsItems : []).map(news => ({
          id: `news-${news.id || Math.random().toString(36).substring(2, 9)}`,
          title: news.title || '',
          content: news.content || '',
          type: 'news',
          url: `/${locale}/news/${news.id || ''}`,
          image: news.image || '',
          date: news.date
        })),
        ...(Array.isArray(cases) ? cases : []).map(caseItem => ({
          id: `case-${caseItem.id || Math.random().toString(36).substring(2, 9)}`,
          title: caseItem.title || '',
          content: caseItem.content || '',
          type: 'case',
          url: `/${locale}/cases/${caseItem.id || ''}`,
          image: caseItem.image || '',
          date: caseItem.date
        }))
      ];
      
      // 确保目录存在
      const publicDir = path.join(process.cwd(), 'public', 'search');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      
      // 写入索引文件
      fs.writeFileSync(
        path.join(publicDir, `index-${locale}.json`),
        JSON.stringify(searchItems)
      );
      
      console.log(`Created index for ${locale} with ${searchItems.length} items`);
    }
    
    console.log('Search index created successfully!');
  } catch (error) {
    console.error('Error creating search index:', error);
    
    // 创建一个空的索引文件，以防止构建失败
    const publicDir = path.join(process.cwd(), 'public', 'search');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // 为每种语言创建空索引
    const locales = ['zh', 'en', 'ja', 'asa'];
    for (const locale of locales) {
      fs.writeFileSync(
        path.join(publicDir, `index-${locale}.json`),
        JSON.stringify([])
      );
      console.log(`Created empty index for ${locale} as fallback`);
    }
  }
}

// 执行创建
createSearchIndex(); 