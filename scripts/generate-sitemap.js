const fs = require('fs');
const path = require('path');
const { fetchProducts, fetchNewsItems, fetchCases } = require('./api-adapter');

// 支持的语言列表
const SUPPORTED_LOCALES = ['zh', 'en', 'ja', 'asa', 'ar', 'my'];

// 网站基础 URL - 确保这里使用正确的生产环境 URL
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

// 生成站点地图
async function generateSitemap() {
  try {
    console.log('Generating sitemap...');
    
    // 创建 sitemap 数组
    const sitemapEntries = [];
    
    // 添加首页和基础页面
    for (const locale of SUPPORTED_LOCALES) {
      // 首页
      sitemapEntries.push({
        loc: `${BASE_URL}/${locale}`,
        lastmod: new Date().toISOString().split('T')[0],
        priority: 1.0,
        changefreq: 'daily'
      });
      
      // 关于页面
      sitemapEntries.push({
        loc: `${BASE_URL}/${locale}/about`,
        lastmod: new Date().toISOString().split('T')[0],
        priority: 0.8,
        changefreq: 'weekly'
      });
      
      // 联系页面
      sitemapEntries.push({
        loc: `${BASE_URL}/${locale}/contact`,
        lastmod: new Date().toISOString().split('T')[0],
        priority: 0.8,
        changefreq: 'monthly'
      });
      
      // 搜索页面
      sitemapEntries.push({
        loc: `${BASE_URL}/${locale}/search`,
        lastmod: new Date().toISOString().split('T')[0],
        priority: 0.7,
        changefreq: 'weekly'
      });
      
      // 站点地图页面
      sitemapEntries.push({
        loc: `${BASE_URL}/${locale}/sitemap`,
        lastmod: new Date().toISOString().split('T')[0],
        priority: 0.5,
        changefreq: 'monthly'
      });
      
      // 获取产品数据
      console.log(`Fetching products for ${locale}...`);
      const products = await fetchProducts(locale);
      console.log(`Found ${products.length} products`);
      
      // 添加产品列表页
      sitemapEntries.push({
        loc: `${BASE_URL}/${locale}/products`,
        lastmod: new Date().toISOString().split('T')[0],
        priority: 0.8,
        changefreq: 'daily'
      });
      
      // 添加产品详情页
      for (const product of products) {
        sitemapEntries.push({
          loc: `${BASE_URL}/${locale}/products/${product.id}`,
          lastmod: product.updatedAt || new Date().toISOString().split('T')[0],
          priority: 0.7,
          changefreq: 'weekly'
        });
      }
      
      // 获取新闻数据
      console.log(`Fetching news for ${locale}...`);
      const newsItems = await fetchNewsItems(locale);
      console.log(`Found ${newsItems.length} news items`);
      
      // 添加新闻列表页
      sitemapEntries.push({
        loc: `${BASE_URL}/${locale}/news`,
        lastmod: new Date().toISOString().split('T')[0],
        priority: 0.8,
        changefreq: 'daily'
      });
      
      // 添加新闻详情页
      for (const newsItem of newsItems) {
        sitemapEntries.push({
          loc: `${BASE_URL}/${locale}/news/${newsItem.id}`,
          lastmod: newsItem.date || new Date().toISOString().split('T')[0],
          priority: 0.7,
          changefreq: 'weekly'
        });
      }
      
      // 获取案例数据
      console.log(`Fetching cases for ${locale}...`);
      const cases = await fetchCases(locale);
      console.log(`Found ${cases.length} cases`);
      
      // 添加案例列表页
      sitemapEntries.push({
        loc: `${BASE_URL}/${locale}/cases`,
        lastmod: new Date().toISOString().split('T')[0],
        priority: 0.8,
        changefreq: 'monthly'
      });
      
      // 添加案例详情页
      for (const caseItem of cases) {
        sitemapEntries.push({
          loc: `${BASE_URL}/${locale}/cases/${caseItem.id}`,
          lastmod: caseItem.date || new Date().toISOString().split('T')[0],
          priority: 0.7,
          changefreq: 'monthly'
        });
      }
    }
    
    // 生成 XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.map(entry => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    
    // 确保 public 目录存在
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // 写入文件
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log('Sitemap generated successfully!');
    
    // 生成 robots.txt
    const robots = `# robots.txt
User-agent: *
Allow: /

# Sitemap
Sitemap: ${BASE_URL}/sitemap.xml
`;
    
    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);
    console.log('robots.txt generated successfully!');
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

// 执行生成
generateSitemap(); 