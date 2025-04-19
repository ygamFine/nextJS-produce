import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const locale = searchParams.get('locale') || 'zh';
  
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  
  try {
    let url;
    if (id) {
      url = `${STRAPI_URL}/articles/${id}?populate=*&locale=${locale}`;
    } else {
      url = `${STRAPI_URL}/articles?populate=*&locale=${locale}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    return NextResponse.json({ 
      success: true, 
      data,
      url
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: (error as Error).message 
    }, { status: 500 });
  }
} 