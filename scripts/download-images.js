// 使用 api-adapter.js 中的方法，它是 api.ts 的 CommonJS 适配器
const { fetchProducts, fetchNewsItems, fetchCases } = require('./api-adapter');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const crypto = require('crypto');

// 图片存储目录
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const IMAGE_DIR = path.join(PUBLIC_DIR, 'images', 'cached');

// 确保图片目录存在
if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

// 记录已下载的图片
const downloadedImages = new Set();

/**
 * 下载图片并保存到本地
 * @param {string} url 图片 URL
 * @returns {Promise<string>} 本地图片路径
 */
async function downloadImage(url) {
  // 如果 URL 为空，返回默认图片
  if (!url) return '/placeholder.jpg';
  
  // 如果已经是本地缓存的图片，直接返回
  if (url.startsWith('/images/cached/')) {
    return url;
  }
  
  try {
    // 处理 URL 格式
    let fullUrl = url;
    console.log('原始URL，处理前', fullUrl)
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_PROXY || 'http://127.0.0.1:1337';
      fullUrl = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
      console.log('进入一级验证', fullUrl)
    }
    
    // 特殊处理 Strapi 媒体 URL
    if (fullUrl.includes('strapiapp.com/') && !fullUrl.includes('media.strapiapp.com')) {
      fullUrl = fullUrl.replace('strapiapp.com/', 'media.strapiapp.com/');
      console.log('进入二级验证', fullUrl)
    }
    
    // 生成文件名
    const hash = crypto.createHash('md5').update(fullUrl).digest('hex');
    const ext = path.extname(fullUrl) || '.jpg';
    const filename = `${hash}${ext}`;
    const localPath = path.join(IMAGE_DIR, filename);
    const publicPath = `/images/cached/${filename}`;
    
    // 检查文件是否已存在
    if (fs.existsSync(localPath)) {
      console.log(`Image already exists: ${publicPath}`);
      return publicPath;
    }
    
    console.log(`Downloading image from: ${fullUrl}`);
    
    // 下载图片
    return new Promise((resolve, reject) => {
      const client = fullUrl.startsWith('https') ? https : http;
      
      client.get(fullUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download image: ${response.statusCode}`));
          return;
        }
        
        const chunks = [];
        
        response.on('data', (chunk) => {
          chunks.push(chunk);
        });
        
        response.on('end', () => {
          const buffer = Buffer.concat(chunks);
          fs.writeFileSync(localPath, buffer);
          console.log(`Image downloaded and saved: ${publicPath}`);
          resolve(publicPath);
        });
      }).on('error', (err) => {
        console.error(`Error downloading image: ${err.message}`);
        reject(err);
      });
    });
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error);
    return '/placeholder.jpg';
  }
}

/**
 * 下载所有产品图片
 */
async function downloadProductImages() {
  console.log('Downloading product images...');
  const locales = ['zh', 'en', 'ja', 'asa'];
  
  for (const locale of locales) {
    console.log(`Fetching products for locale: ${locale}`);
    try {
      const products = await fetchProducts(locale);
      console.log(`Found ${products.length} products for locale: ${locale}`);
      
      for (const product of products) {
        if (product.image && !downloadedImages.has(product.image)) {
          const localPath = await downloadImage(product.image);
          downloadedImages.add(product.image);
          console.log(`Product image downloaded: ${product.image} -> ${localPath}`);
        }
      }
    } catch (error) {
      console.error(`Error downloading product images for ${locale}:`, error);
    }
  }
}

/**
 * 下载所有新闻图片
 */
async function downloadNewsImages() {
  console.log('Downloading news images...');
  const locales = ['zh', 'en', 'ja', 'asa'];
  
  for (const locale of locales) {
    console.log(`Fetching news for locale: ${locale}`);
    try {
      const newsItems = await fetchNewsItems(locale);
      console.log(`Found ${newsItems.length} news items for locale: ${locale}`);
      
      for (const item of newsItems) {
        if (item.image && !downloadedImages.has(item.image)) {
          const localPath = await downloadImage(item.image);
          downloadedImages.add(item.image);
          console.log(`News image downloaded: ${item.image} -> ${localPath}`);
        }
      }
    } catch (error) {
      console.error(`Error downloading news images for ${locale}:`, error);
    }
  }
}

/**
 * 下载所有案例图片
 */
async function downloadCaseImages() {
  console.log('Downloading case images...');
  const locales = ['zh', 'en', 'ja', 'asa'];
  
  for (const locale of locales) {
    console.log(`Fetching cases for locale: ${locale}`);
    try {
      const cases = await fetchCases(locale);
      console.log(`Found ${cases.length} cases for locale: ${locale}`);
      
      for (const item of cases) {
        if (item.image && !downloadedImages.has(item.image)) {
          const localPath = await downloadImage(item.image);
          downloadedImages.add(item.image);
          console.log(`Case image downloaded: ${item.image} -> ${localPath}`);
        }
      }
    } catch (error) {
      console.error(`Error downloading case images for ${locale}:`, error);
    }
  }
}

/**
 * 下载所有图片
 */
async function downloadAllImages() {
  try {
    console.log('Starting image download process...');
    
    await downloadProductImages();
    await downloadNewsImages();
    await downloadCaseImages();
    
    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
    process.exit(1);
  }
}

// 执行下载
downloadAllImages(); 