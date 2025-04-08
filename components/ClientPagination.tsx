'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
}

interface ClientPaginationProps {
  products: Product[];
  locale: string;
}

export function ClientPagination({ products, locale }: ClientPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 从 URL 获取初始分页状态
  const initialPage = Number(searchParams.get('page')) || 1;
  const initialPageSize = Number(searchParams.get('pageSize')) || 5;
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  
  // 计算总页数
  const totalPages = Math.ceil(products.length / pageSize);
  
  // 计算当前页的产品
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProducts = products.slice(startIndex, endIndex);
  
  // 当 URL 参数变化时更新状态
  useEffect(() => {
    const page = Number(searchParams.get('page')) || 1;
    const size = Number(searchParams.get('pageSize')) || 5;
    
    setCurrentPage(page);
    setPageSize(size);
  }, [searchParams]);
  
  // 更新 URL 但不触发页面刷新
  const updateUrl = (page: number, size: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    params.set('pageSize', size.toString());
    
    router.push(`/${locale}/products?${params.toString()}`, { scroll: false });
  };
  
  // 页码变化处理
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrl(page, pageSize);
  };
  
  // 页面大小变化处理
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // 重置到第一页
    updateUrl(1, size);
  };
  
  // 计算要显示的页码范围
  const getPageNumbers = () => {
    const range = 2; // 当前页前后显示的页数
    let pages = [];
    
    // 添加页码
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // 第一页
        i === totalPages || // 最后一页
        (i >= currentPage - range && i <= currentPage + range) // 当前页附近
      ) {
        pages.push(i);
      } else if (
        (i === currentPage - range - 1 && i > 1) || // 前省略号
        (i === currentPage + range + 1 && i < totalPages) // 后省略号
      ) {
        pages.push(-i); // 负数表示省略号位置
      }
    }
    
    // 去重并排序
    return [...new Set(pages)].sort((a, b) => Math.abs(a) - Math.abs(b));
  };
  
  return (
    <div>
      {/* 页面大小选择器 */}
      <div className="flex items-center justify-end mb-6">
        <span className="mr-2 text-gray-600">
          {locale === 'en' ? 'Items per page:' : '每页显示:'}
        </span>
        <div className="flex space-x-2">
          {[3, 5, 10].map(size => (
            <button
              key={size}
              onClick={() => handlePageSizeChange(size)}
              className={`px-3 py-1 border rounded-md transition ${
                pageSize === size 
                  ? 'bg-indigo-600 text-white' 
                  : 'hover:bg-gray-50'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      
      {/* 产品列表 */}
      {currentProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentProducts.map(product => (
            <Link 
              href={`/${locale}/products/${product.id}`} 
              key={product.id}
              className="group"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-indigo-600 transition">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-lg font-bold text-indigo-600">
                    ¥{product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {locale === 'en' ? 'No products found' : '没有找到产品'}
          </p>
        </div>
      )}
      
      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-1 mt-8">
          {/* 上一页按钮 */}
          <button
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className={`px-4 py-2 border rounded-md transition ${
              currentPage <= 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'hover:bg-gray-50'
            }`}
          >
            {locale === 'en' ? 'Previous' : '上一页'}
          </button>
          
          {/* 页码 */}
          {getPageNumbers().map((page, index) => {
            if (page < 0) {
              // 省略号
              return (
                <span key={`ellipsis-${index}`} className="px-4 py-2">
                  ...
                </span>
              );
            }
            
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 border rounded-md transition ${
                  page === currentPage 
                    ? 'bg-indigo-600 text-white' 
                    : 'hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}
          
          {/* 下一页按钮 */}
          <button
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`px-4 py-2 border rounded-md transition ${
              currentPage >= totalPages 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'hover:bg-gray-50'
            }`}
          >
            {locale === 'en' ? 'Next' : '下一页'}
          </button>
        </div>
      )}
    </div>
  );
} 