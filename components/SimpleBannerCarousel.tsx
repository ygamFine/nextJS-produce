'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Banner } from '@/lib/types'

interface SimpleBannerCarouselProps {
  banners: Banner[]
  locale: string
}

export function SimpleBannerCarousel({ banners, locale }: SimpleBannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // 自动轮播
  useEffect(() => {
    if (banners.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000) // 每5秒切换一次
    
    return () => clearInterval(interval)
  }, [banners.length])
  
  // 如果没有横幅数据，显示占位符
  if (banners.length === 0) {
    return (
      <div className="h-[500px] bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">
          {locale === 'en' ? 'No banner data available' : '暂无横幅数据'}
        </p>
      </div>
    )
  }
  
  return (
    <div className="relative h-[500px] overflow-hidden">
      {banners.map((banner, index) => (
        <div 
          key={banner.id} 
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img 
            src={banner.image} 
            alt={banner.title || 'Banner'} 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {banner.title || '欢迎访问我们的网站'}
              </h1>
              <p className="text-xl text-white mb-8 max-w-2xl">
                {banner.description || ''}
              </p>
              {banner.link && (
                <Link href={`/${locale}${banner.link}`}>
                  <span className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-md transition">
                    {locale === 'en' ? 'Learn More' : '了解更多'}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {/* 导航按钮 */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
      
      {/* 左右箭头 */}
      {banners.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50"
            onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  )
} 