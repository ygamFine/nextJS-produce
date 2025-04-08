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
  
  // 处理图片加载完成
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  
  // 处理图片加载错误
  const handleImageError = (e: any) => {
    console.error(`Error loading image: ${src}`, e);
    setIsLoading(false);
  };
  
  // 确保 src 是有效的 URL
  const imageSrc = src || '/placeholder.jpg';
  
  return (
    <div className={`relative overflow-hidden ${fill ? 'w-full h-full' : ''} ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {fill ? (
        <Image
          src={imageSrc}
          alt={alt}
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
          src={imageSrc}
          alt={alt}
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