const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

// 基础 URL 配置
const STRAPI_URL = 'http://127.0.0.1:1337/api';
const STRAPI_URL_IMG = 'http://127.0.0.1:1337';

// 辅助函数：获取 JSON 数据
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// 获取产品列表
async function fetchProducts(locale = 'zh') {
  try {
    const url = `${STRAPI_URL}/products?populate=*&sort=createdAt:desc&locale=${locale}`;
    const data = await fetchJson(url);
    
    return data.data?.map((item) => ({
      id: item.documentId || item.id,
      name: item.name || item.attributes?.name,
      description: item.decs || item.attributes?.description,
      price: item.price || 0,
      image: item.image?.url 
        ? `${STRAPI_URL_IMG}${item.image?.url}`
        : '/placeholder.jpg',
      category: item.category
    })) || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// 获取新闻列表
async function fetchNewsItems(locale = 'zh') {
  try {
    const url = `${STRAPI_URL}/news-items?populate=*&sort=publishDate:desc&locale=${locale}`;
    const data = await fetchJson(url);
    
    return data.data?.map((item) => ({
      id: item.id,
      title: item.attributes?.title || item.title,
      content: item.attributes?.content || item.content,
      date: item.attributes?.publishDate || item.date,
      image: item.attributes?.image?.data?.attributes?.url 
        ? `${STRAPI_URL_IMG}${item.attributes.image.data.attributes.url}`
        : '/placeholder.jpg'
    })) || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

// 获取案例列表
async function fetchCases(locale = 'zh') {
  try {
    const url = `${STRAPI_URL}/cases?populate=*&sort=publishDate:desc&locale=${locale}`;
    const data = await fetchJson(url);
    
    return data.data?.map((item) => ({
      id: item.id,
      title: item.attributes?.title || item.title,
      content: item.attributes?.content || item.content,
      date: item.attributes?.publishDate || item.date,
      image: item.attributes?.image?.data?.attributes?.url 
        ? `${STRAPI_URL_IMG}${item.attributes.image.data.attributes.url}`
        : '/placeholder.jpg'
    })) || [];
  } catch (error) {
    console.error('Error fetching cases:', error);
    return [];
  }
}

// 创建搜索索引
async function createSearchIndex() {
  try {
    console.log('Creating search index...');
    
    // 获取所有语言
    const locales = ['zh', 'en', 'ja', 'asa'];
    
    // 为每种语言创建索引
    for (const locale of locales) {
      console.log(`Creating index for locale: ${locale}`);
      
      // 创建模拟数据（如果 API 不可用）
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
      
      // 获取数据，使用空数组作为默认值
      let products = [];
      let newsItems = [];
      let cases = [];
      
      try {
        products = await fetchProducts(locale);
        console.log(`获取到 ${products.length} 个产品`);
      } catch (error) {
        console.warn(`加载产品列表失败 for ${locale}:`, error.message);
      }
      
      try {
        newsItems = await fetchNewsItems(locale);
        console.log(`获取到 ${newsItems.length} 条新闻`);
      } catch (error) {
        console.warn(`加载新闻列表失败 for ${locale}:`, error.message);
      }
      
      try {
        cases = await fetchCases(locale);
        console.log(`获取到 ${cases.length} 个案例`);
      } catch (error) {
        console.warn(`加载案例列表失败 for ${locale}:`, error.message);
      }
      
      // 转换为搜索项
      let searchItems = [
        ...(Array.isArray(products) && products.length > 0 ? products : []).map(product => ({
          id: `product-${product.id || Math.random().toString(36).substring(2, 9)}`,
          title: product.name || '',
          content: product.description || '',
          type: 'product',
          url: `/${locale}/products/${product.id || ''}`,
          image: product.image || '',
          price: product.price
        })),
        ...(Array.isArray(newsItems) && newsItems.length > 0 ? newsItems : []).map(news => ({
          id: `news-${news.id || Math.random().toString(36).substring(2, 9)}`,
          title: news.title || '',
          content: news.content || '',
          type: 'news',
          url: `/${locale}/news/${news.id || ''}`,
          image: news.image || '',
          date: news.date
        })),
        ...(Array.isArray(cases) && cases.length > 0 ? cases : []).map(caseItem => ({
          id: `case-${caseItem.id || Math.random().toString(36).substring(2, 9)}`,
          title: caseItem.title || '',
          content: caseItem.content || '',
          type: 'case',
          url: `/${locale}/cases/${caseItem.id || ''}`,
          image: caseItem.image || '',
          date: caseItem.date
        }))
      ];
      
      // 如果没有获取到任何数据，使用模拟数据
      if (searchItems.length === 0) {
        console.log(`没有获取到任何数据，使用模拟数据`);
        searchItems = mockData;
      }
      
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