import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

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