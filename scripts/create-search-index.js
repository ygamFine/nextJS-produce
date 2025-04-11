// 使用 api-adapter.js 中的方法，它是 api.ts 的 CommonJS 适配器
const { fetchProducts, fetchNewsItems, fetchCases } = require('./api-adapter');
const fs = require('fs');
const path = require('path');

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
        // 使用 api-adapter.js 中的方法获取产品
        products = await fetchProducts(locale);
        console.log(`Fetched ${products.length} products for ${locale}`);
      } catch (error) {
        console.warn(`Failed to fetch products for ${locale}:`, error.message);
      }
      
      try {
        // 使用 api-adapter.js 中的方法获取新闻
        newsItems = await fetchNewsItems(locale);
        console.log(`Fetched ${newsItems.length} news items for ${locale}`);
      } catch (error) {
        console.warn(`Failed to fetch news for ${locale}:`, error.message);
      }
      
      try {
        // 使用 api-adapter.js 中的方法获取案例
        cases = await fetchCases(locale);
        console.log(`Fetched ${cases.length} cases for ${locale}`);
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
    
    // 为每种语言创建模拟索引
    const locales = ['zh', 'en', 'ja', 'asa'];
    for (const locale of locales) {
      const mockData = [
        {
          id: `product-mock-1`,
          title: locale === 'en' ? 'Sample Product 1' : '示例产品 1',
          content: locale === 'en' ? 'This is a sample product description' : '这是一个示例产品描述',
          type: 'product',
          url: `/${locale}/products/1`,
          image: '/placeholder.jpg',
          price: 100
        },
        {
          id: `news-mock-1`,
          title: locale === 'en' ? 'Sample News 1' : '示例新闻 1',
          content: locale === 'en' ? 'This is a sample news content' : '这是一个示例新闻内容',
          type: 'news',
          url: `/${locale}/news/1`,
          image: '/placeholder.jpg',
          date: '2023-01-01'
        }
      ];
      
      fs.writeFileSync(
        path.join(publicDir, `index-${locale}.json`),
        JSON.stringify(mockData)
      );
      console.log(`Created mock index for ${locale} as fallback`);
    }
  }
}

// 执行创建
createSearchIndex(); 