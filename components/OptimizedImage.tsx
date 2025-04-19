'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  sizes = '100vw',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  // 处理图片加载完成
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  
  // 处理图片加载错误
  const handleImageError = () => {
    setIsLoading(false);
    setIsError(true);
    console.error(`Failed to load image: ${src}`);
  };
  
  // 处理图片 URL
  const imgSrc = (!src || isError) ? '/placeholder-news.jpg' : src;
  
  return (
    <div className={`relative overflow-hidden ${className} h-full`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {fill ? (
        <Image
          src={imgSrc}
          alt={alt || ''}
          fill
          sizes={sizes}
          priority={priority}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
        />
      ) : (
        <Image
          src={imgSrc}
          alt={alt || ''}
          width={width || 800}
          height={height || 600}
          priority={priority}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}
    </div>
  );
} 