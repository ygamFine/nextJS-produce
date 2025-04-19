import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { fetchProducts, fetchNewsItems } from '@/lib/api';

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
    
    // 如果在服务器端，将索引写入文件
    if (typeof window === 'undefined') {
      try {
        const fs = await import('fs').catch(() => null);
        const path = await import('path').catch(() => null);
        
        if (fs && path) {
          const indexPath = path.join(process.cwd(), 'public', 'search-index.json');
          fs.writeFileSync(indexPath, JSON.stringify(searchIndex, null, 2));
          console.log(`Search index written to ${indexPath}`);
        }
      } catch (error) {
        console.error('Error writing search index to file:', error);
      }
    }
    
    return searchIndex;
  } catch (error) {
    console.error('Error creating search index:', error);
    throw error;
  }
}

// API 路由处理函数
export async function GET(request: Request) {
  try {
    // 检查授权（可选）
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('key');
    
    // 如果设置了 API_KEY 环境变量，则验证请求中的 key
    const expectedKey = process.env.REBUILD_INDEX_API_KEY;
    if (expectedKey && apiKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // 创建搜索索引
    const searchIndex = await createSearchIndex();
    
    return NextResponse.json({
      success: true,
      message: 'Search index rebuilt successfully'
    });
  } catch (error) {
    console.error('Error in rebuild-index API route:', error);
    return NextResponse.json(
      { error: 'Failed to rebuild search index', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 验证请求
    const apiKey = request.headers.get('x-api-key');
    const validApiKey = process.env.REBUILD_API_KEY;
    
    if (!validApiKey || apiKey !== validApiKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // 获取要重建的标签
    const body = await request.json();
    const tags = body.tags || ['prod', 'news', 'case'];
    
    // 重新验证标签
    for (const tag of tags) {
      revalidateTag(tag);
    }
    
    return NextResponse.json({
      revalidated: true,
      tags,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error rebuilding index:', error);
    return NextResponse.json(
      { error: 'Failed to rebuild index' },
      { status: 500 }
    );
  }
} 