import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.json()
    
    // 获取 API Token
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN
    if (!token) {
      return NextResponse.json({ error: 'API Token not configured' }, { status: 500 })
    }
    
    // 发送到 Strapi
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/contact-forms`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: formData }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to submit contact form')
    }
    
    const data = await response.json()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 })
  }
} 