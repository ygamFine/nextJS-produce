// 这个文件用于将 TypeScript API 模块转换为 CommonJS 模块
// 使用 Next.js 的 API 路由来获取数据

const http = require('http');
const https = require('https');

// 基础 URL 配置
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://127.0.0.1:1337/api';
const STRAPI_URL_IMG = process.env.NEXT_PUBLIC_STRAPI_API_PROXY || 'http://127.0.0.1:1337';

// 获取产品列表
async function fetchProducts(locale = 'zh') {
  try {
    const url = `${STRAPI_URL}/products?populate=*&sort=createdAt:desc&locale=${locale}`;
    const data = await fetchJson(url);
    
    return data.data?.map((item) => ({
      id: item.documentId,
      name: item.name,
      description: item.decs,
      price: item.price || 0,
      image: item.image?.url && !item.image?.url.startsWith('http://') && !item.image?.url.startsWith('https://')
        ? `${STRAPI_URL_IMG}${item.image?.url}`
        : `${item.image?.url}` || '/placeholder.jpg',
      category: item.category
    })) || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// 获取新闻列表
async function fetchNewsItems(locale = 'zh', page = 1, pageSize = 10) {
  try {
    const url = `${STRAPI_URL}/articles?populate=*&locale=${locale}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
    const data = await fetchJson(url);
    
    // 转换 Strapi 响应格式为应用所需格式
    return (data.data || []).map((item) => {
      // 确保内容是字符串
      let content = '';
      if (typeof item.description === 'string') {
        content = item.description;
      } else if (item.description) {
        try {
          content = JSON.stringify(item.description);
        } catch (e) {
          content = '';
        }
      }
      
      return {
        id: item.documentId || item.id,
        title: item.title || '',
        summary: item.title || '',
        content: content,
        date: item.createdAt || item.date,
        author: item.author?.name || '',
        image: item.cover?.url 
          ? formatImageUrl(item.cover.url)
          : '/placeholder-news.jpg',
        slug: item.slug || item.documentId || item.id
      };
    });
  } catch (error) {
    console.error('Error fetching news items:', error);
    return [];
  }
}

// 获取案例列表
async function fetchCases(locale = 'zh') {
  try {
    const url = `${STRAPI_URL}/cases?populate=*&sort=createdAt:desc&locale=${locale}`;
    const data = await fetchJson(url);
    
    return data.data?.map((item) => ({
      id: item.id,
      title: item.attributes.title,
      description: item.attributes.description,
      image: item.attributes.image?.data?.attributes?.url 
        ? `${STRAPI_URL_IMG}${item.attributes.image.data.attributes.url}`
        : '/placeholder.jpg',
      client: item.attributes.client,
      date: item.attributes.date
    })) || [];
  } catch (error) {
    console.error('Error fetching cases:', error);
    return [];
  }
}

// 获取支持的语言列表
async function fetchSupportedLocales() {
  try {
    const url = `${STRAPI_URL}/i18n/locales`;
    const data = await fetchJson(url);
    
    return data.map((locale) => ({
      code: locale.code,
      name: locale.name
    }));
  } catch (error) {
    console.error('api-adapter 100 Error fetching supported locales:', error);
    // 返回默认语言列表
    return [
      { code: 'zh', name: '中文' },
      { code: 'en', name: 'English' }
    ];
  }
}

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

/**
 * 格式化图片 URL
 * @param {string} url 图片 URL
 * @returns {string} 格式化后的 URL
 */
function formatImageUrl(url) {
  if (!url) return '/placeholder.jpg';
  
  // 如果已经是完整的 URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // 如果是相对路径，添加基础 URL
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_PROXY || 'http://127.0.0.1:1337';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

module.exports = {
  fetchProducts,
  fetchNewsItems,
  fetchCases,
  fetchSupportedLocales,
  formatImageUrl
}; 