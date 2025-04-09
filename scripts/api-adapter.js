// 这个文件用于将 TypeScript API 模块转换为 CommonJS 模块
// 使用 Next.js 的 API 路由来获取数据

const http = require('http');
const https = require('https');

// 基础 URL 配置
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://127.0.0.1:1337/api';
const STRAPI_URL_IMG = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://127.0.0.1:1337';

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
      title: item.attributes.title,
      content: item.attributes.content,
      date: item.attributes.publishDate,
      image: item.attributes.image?.data?.attributes?.url 
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
      title: item.attributes.title,
      content: item.attributes.content,
      date: item.attributes.publishDate,
      image: item.attributes.image?.data?.attributes?.url 
        ? `${STRAPI_URL_IMG}${item.attributes.image.data.attributes.url}`
        : '/placeholder.jpg'
    })) || [];
  } catch (error) {
    console.error('Error fetching cases:', error);
    return [];
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

module.exports = {
  fetchProducts,
  fetchNewsItems,
  fetchCases
}; 