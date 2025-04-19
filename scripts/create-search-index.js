// 使用 api-adapter.js 中的方法，它是 api.ts 的 CommonJS 适配器
const { fetchProducts, fetchNewsItems, fetchCases } = require('./api-adapter');
const fs = require('fs');
const path = require('path');

// 创建搜索索引
async function createSearchIndex() {
  try {
    console.log('Creating search index...');
    
    // 获取中文和英文产品数据
    const zhProducts = await fetchProducts('zh');
    const enProducts = await fetchProducts('en');
    
    // 获取中文和英文新闻数据
    const zhNews = await fetchNewsItems('zh', 1, 100);
    const enNews = await fetchNewsItems('en', 1, 100);
    
    // 合并所有数据
    const searchIndex = {
      zh: {
        products: zhProducts.map(product => ({
          id: product.id,
          type: 'product',
          title: product.name,
          content: product.description,
          url: `/zh/products/${product.id}`
        })),
        news: zhNews.map(news => ({
          id: news.id,
          type: 'news',
          title: news.title,
          content: news.summary || (news.content ? news.content.substring(0, 200) : ''),
          url: `/zh/news/${news.id}`
        }))
      },
      en: {
        products: enProducts.map(product => ({
          id: product.id,
          type: 'product',
          title: product.name,
          content: product.description,
          url: `/en/products/${product.id}`
        })),
        news: enNews.map(news => ({
          id: news.id,
          type: 'news',
          title: news.title,
          content: news.summary || (news.content ? news.content.substring(0, 200) : ''),
          url: `/en/news/${news.id}`
        }))
      }
    };
    
    // 确保 public 目录存在
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // 写入搜索索引文件
    const indexPath = path.join(publicDir, 'search-index.json');
    fs.writeFileSync(indexPath, JSON.stringify(searchIndex, null, 2));
    
    console.log(`Search index written to ${indexPath}`);
  } catch (error) {
    console.error('Error creating search index:', error);
    process.exit(1);
  }
}

// 执行函数
createSearchIndex(); 