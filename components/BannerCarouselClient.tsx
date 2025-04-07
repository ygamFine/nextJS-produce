'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface BannerProps {
  banners: any[];
  locale: string;
  autoPlay?: boolean;
  interval?: number;
}

export function BannerCarouselClient({ banners, locale, autoPlay = true, interval = 5000 }: BannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  // 添加调试代码，帮助我们了解 banner 数据结构
  useEffect(() => {
    console.log('Banner data in client component:', banners);
    if (banners.length > 0) {
      console.log('First banner image URL:', banners[0].image);
    }
  }, [banners]);
  
  // 自动轮播
  useEffect(() => {
    if (autoPlay && !isHovering && !isPaused && banners.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
      }, interval);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [autoPlay, interval, banners.length, isHovering, isPaused]);
  
  // 如果没有横幅数据，显示占位符
  if (banners.length === 0) {
    return (
      <div className="h-[500px] bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">
          {locale === 'en' ? 'No banner data available' : '暂无横幅数据'}
        </p>
      </div>
    );
  }
  
  const currentBanner = banners[currentIndex];
  
  // 切换到下一张
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  // 切换到上一张
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  // 直接跳转到指定索引
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  // 处理触摸事件
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // 向左滑动，显示下一张
      nextSlide();
    }

    if (touchStart - touchEnd < -50) {
      // 向右滑动，显示上一张
      prevSlide();
    }
  };
  
  // 切换暂停/播放状态
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  return (
    <div 
      className="relative h-[500px] overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 图片 */}
      <img 
        src={currentBanner.image || '/placeholder.jpg'} 
        alt={currentBanner.title || ''} 
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
      />
      
      {/* 内容覆盖层 */}
      <div className="absolute inset-0 bg-opacity-40 flex items-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 shadow-text">
            {currentBanner.title}
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl shadow-text">
            {currentBanner.description}
          </p>
          {currentBanner.link && (
            <Link href={`/${locale}${currentBanner.link}`}>
              <span className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-md transition">
                {locale === 'en' ? 'Learn More' : '了解更多'}
              </span>
            </Link>
          )}
        </div>
      </div>
      
      {/* 左右箭头导航 - 改进样式 */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 text-black hover:bg-opacity-100 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold shadow-lg transition-all z-20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label={locale === 'en' ? 'Previous' : '上一张'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 text-black hover:bg-opacity-100 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold shadow-lg transition-all z-20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label={locale === 'en' ? 'Next' : '下一张'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* 底部指示器 - 改进样式 */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white scale-125 shadow-lg' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`跳转到第 ${index + 1} 张`}
            />
          ))}
        </div>
      )}
      
      
      {/* 播放/暂停按钮 */}
      {autoPlay && banners.length > 1 && (
        <button
          onClick={togglePause}
          className="absolute bottom-6 left-6 bg-black bg-opacity-60 text-white w-10 h-10 flex items-center justify-center rounded-full z-10 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label={isPaused ? (locale === 'en' ? 'Play' : '播放') : (locale === 'en' ? 'Pause' : '暂停')}
        >
          {isPaused ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      )}
      
      {/* 添加渐变覆盖层，使文字更易读 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
      
      <style jsx>{`
        .shadow-text {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
} 