'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { OptimizedImage } from './OptimizedImage';

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
}

interface BannerCarouselProps {
  banners: Banner[];
  locale: string;
}

export function BannerCarouselClient({ banners, locale }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 自动轮播
  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [banners.length]);
  
  // 如果没有横幅，显示默认内容
  if (!banners || banners.length === 0) {
    return (
      <div className="relative h-96 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">
            {locale === 'en' ? 'Welcome to Our Website' : '欢迎访问我们的网站'}
          </h2>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative h-96 overflow-hidden">
      {/* 轮播图片 */}
      <div className="relative h-full">
        {banners.map((banner, index) => (
          <div 
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <OptimizedImage 
              src={banner.image} 
              alt={banner.title} 
              fill
              priority={index === 0} // 首图优先加载
              sizes="100vw"
              className="w-full h-full"
            />
            
            {/* 内容覆盖层 */}
            <div className="absolute inset-0 bg-opacity-40 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-xl">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    {banner.title}
                  </h2>
                  {banner.subtitle && (
                    <p className="text-xl text-white mb-6">
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.link && (
                    <Link href={banner.link}>
                      <span className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-md transition">
                        {locale === 'en' ? 'Learn More' : '了解更多'}
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* 导航点 */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {/* 左右箭头 */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
} 