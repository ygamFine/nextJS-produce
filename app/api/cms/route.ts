import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { fetchProducts, fetchNewsItems, fetchCases } from '@/lib/api';

// 创建搜索索引的函数
async function createSearchIndex() {
  try {
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
          content: news.summary || news.content.substring(0, 200),
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
          content: news.summary || news.content.substring(0, 200),
          url: `/en/news/${news.id}`
        }))
      }
    };
    
    // 在实际应用中，这里应该将索引写入文件系统
    // 但在 API 路由中，我们只返回生成的索引
    return searchIndex;
  } catch (error) {
    console.error('Error creating search index:', error);
    throw error;
  }
}

// 统一的内容管理 API 端点
export async function GET(request: NextRequest) {
  try {
    // 获取操作类型参数
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'revalidate'; // 默认为 revalidate
    const apiKey = searchParams.get('key');
    
    // 验证 API 密钥
    const expectedKey = process.env.CMS_API_KEY || process.env.REBUILD_API_KEY;
    // 如果 apiKey 不是 'YGAM' 且不匹配环境变量中的密钥，则拒绝访问
    if (apiKey !== 'YGAM' && (expectedKey && apiKey !== expectedKey)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // 获取要操作的标签
    const tagsParam = searchParams.get('tags');
    const tags = tagsParam ? tagsParam.split(',') : ['prod', 'news', 'case'];
    
    // 根据操作类型执行不同的功能
    let result = {};
    
    if (action === 'rebuild-index' || action === 'all') {
      // 重建搜索索引
      const searchIndex = await createSearchIndex();
      result = { ...result, indexRebuilt: true, searchIndex };
    }
    
    if (action === 'revalidate' || action === 'all') {
      // 重新验证页面
      for (const tag of tags) {
        console.log(`Revalidating tag: ${tag}`);
        revalidateTag(tag);
      }
      result = { ...result, revalidated: true, tags };
    }
    
    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('CMS API error:', error);
    return NextResponse.json(
      { 
        error: 'Operation failed', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 