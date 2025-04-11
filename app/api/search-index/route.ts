import { NextRequest, NextResponse } from 'next/server';
import { fetchProducts, fetchNewsItems, fetchCases } from '@/lib/api';

// 生成搜索索引的函数
async function generateSearchIndex(locale: string) {
  try {
    // 获取所有数据
    const products = await fetchProducts(locale);
    const newsItems = await fetchNewsItems(locale);
    const cases = await fetchCases(locale);
    
    // 转换为搜索项
    const searchItems = [
      ...(Array.isArray(products) ? products : []).map(product => ({
        id: `product-${product.id}`,
        title: product.name || '',
        content: product.description || '',
        type: 'product' as const,
        url: `/${locale}/products/${product.id}`,
        image: product.image || '/placeholder.jpg',
        price: product.price
      })),
      
      ...(Array.isArray(newsItems) ? newsItems : []).map(item => ({
        id: `news-${item.id}`,
        title: item.title || '',
        content: item.content || '',
        type: 'news' as const,
        url: `/${locale}/news/${item.id}`,
        image: item.image || '/placeholder.jpg',
        date: item.date
      })),
      
      ...(Array.isArray(cases) ? cases : []).map(item => ({
        id: `case-${item.id}`,
        title: item.title || '',
        content: item.content || '',
        type: 'case' as const,
        url: `/${locale}/cases/${item.id}`,
        image: item.image || '/placeholder.jpg',
        date: item.date
      }))
    ];
    
    return searchItems;
  } catch (error) {
    console.error(`Error generating search index for ${locale}:`, error);
    return [];
  }
}

// API 路由处理函数
export async function GET(request: NextRequest) {
  try {
    // 从查询参数获取语言
    const locale = request.nextUrl.searchParams.get('locale') || 'zh';
    
    // 检查是否有有效的 API 密钥（可选，用于保护 API）
    const apiKey = request.headers.get('x-api-key');
    const validApiKey = process.env.SEARCH_API_KEY;
    
    if (validApiKey && apiKey !== validApiKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // 生成搜索索引
    const searchIndex = await generateSearchIndex(locale);
    
    // 返回搜索索引
    return NextResponse.json(searchIndex, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('Error in search index API:', error);
    return NextResponse.json(
      { error: 'Failed to generate search index' },
      { status: 500 }
    );
  }
} 