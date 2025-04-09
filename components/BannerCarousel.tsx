'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Banner } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocale } from '@/contexts/LocaleContext'

interface BannerCarouselProps {
  banners: any
  locale: string
  autoPlay?: boolean
  interval?: number
  showPagination?: boolean
}

export function BannerCarousel({ 
  banners, 
  locale, 
  autoPlay = true, 
  interval = 5000,
  showPagination = true
}: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { t } = useLocale()
  
  console.log('Banners length:', banners.length)
  
  // 自动轮播
  useEffect(() => {
    if (autoPlay && !isHovering && !isPaused && banners.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
      }, interval)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [autoPlay, interval, banners.length, isHovering, isPaused])
  
  // 添加键盘导航支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide()
      } else if (e.key === 'ArrowRight') {
        nextSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  
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
  
  const currentBanner = banners[currentIndex]
  
  // 切换到下一张
  const nextSlide = () => {
    console.log('Next slide clicked')
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % banners.length
      console.log(`Changing from ${prevIndex} to ${newIndex}`)
      return newIndex
    })
  }

  // 切换到上一张
  const prevSlide = () => {
    console.log('Previous slide clicked')
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + banners.length) % banners.length
      console.log(`Changing from ${prevIndex} to ${newIndex}`)
      return newIndex
    })
  }

  // 直接跳转到指定索引
  const goToSlide = (index: number) => {
    console.log(`Go to slide ${index} clicked`)
    setCurrentIndex(index)
  }
  
  // 处理触摸事件
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // 向左滑动，显示下一张
      nextSlide()
    }

    if (touchStart - touchEnd < -50) {
      // 向右滑动，显示上一张
      prevSlide()
    }
  }
  
  return (
    <div 
      className="relative w-full h-[500px] overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 轮播内容 */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${currentBanner.image})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  {currentBanner.title || '欢迎访问我们的网站'}
                </h2>
                <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                  {currentBanner.description || ''}
                </p>
                {currentBanner.link && (
                  <Link 
                    href={`/${locale}${currentBanner.link}`}
                    className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                  >
                    {t('banner.learnMore', '了解更多')}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 左右箭头导航 - 使用 Unicode 字符 */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white text-black hover:bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold shadow-lg transition-all z-20"
            aria-label={t('banner.previous', '上一张')}
          >
            &lt;
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-black hover:bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold shadow-lg transition-all z-20"
            aria-label={t('banner.next', '下一张')}
          >
            &gt;
          </button>
        </>
      )}

      {/* 底部指示器 */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white scale-110' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`跳转到第 ${index + 1} 张`}
            />
          ))}
        </div>
      )}
      
      {/* 分页器 */}
      {showPagination && banners.length > 1 && (
        <div className="absolute bottom-12 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm z-10">
          {currentIndex + 1} / {banners.length}
        </div>
      )}
      
      {/* 播放/暂停按钮 */}
      {autoPlay && banners.length > 1 && (
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="absolute bottom-12 left-4 bg-black bg-opacity-50 text-white w-8 h-8 flex items-center justify-center rounded-full z-10"
          aria-label={isPaused ? t('banner.play', '播放') : t('banner.pause', '暂停')}
        >
          {isPaused ? '▶' : '❚❚'}
        </button>
      )}
    </div>
  )
} 