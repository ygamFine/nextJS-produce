import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.json()
    
    // 获取环境变量
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL
    const apiToken = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
    
    if (!apiToken) {
      console.error('API Token not configured')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    
    // 记录请求详情（仅在开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log(`Sending request to: ${apiUrl}/inquiries`)
      console.log('Request body:', { data: formData })
    }
    
    // 发送请求到 Strapi
    const response = await fetch(`${apiUrl}/inquiries`, {
      method: 'POST',
      headers: {
        'Authorization': `${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: formData }),
    })
    
    // 如果请求失败，记录详细错误
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Strapi API error (${response.status}): ${errorText}`)
      return NextResponse.json(
        { error: 'Failed to submit form' }, 
        { status: response.status }
      )
    }
    
    // 返回成功响应
    const data = await response.json()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error in contact API route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 