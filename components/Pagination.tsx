import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  locale: string;
  pageSize: number;
}

export function Pagination({ currentPage, totalPages, basePath, locale, pageSize }: PaginationProps) {
  // 如果只有一页，不显示分页
  if (totalPages <= 1) return null;
  
  // 计算要显示的页码范围
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
  pages = Array.from(new Set(pages)).sort((a, b) => Math.abs(a) - Math.abs(b));
  
  return (
    <div className="flex justify-center items-center space-x-1 mt-8">
      {/* 上一页按钮 */}
      {currentPage > 1 ? (
        <Link 
          href={`/${locale}${basePath}?page=${currentPage - 1}&pageSize=${pageSize}`}
          className="px-4 py-2 border rounded-md hover:bg-gray-50 transition"
        >
          {locale === 'en' ? 'Previous' : '上一页'}
        </Link>
      ) : (
        <span className="px-4 py-2 border rounded-md text-gray-400 cursor-not-allowed">
          {locale === 'en' ? 'Previous' : '上一页'}
        </span>
      )}
      
      {/* 页码 */}
      {pages.map((page, index) => {
        if (page < 0) {
          // 省略号
          return (
            <span key={`ellipsis-${index}`} className="px-4 py-2">
              ...
            </span>
          );
        }
        
        return page === currentPage ? (
          // 当前页
          <span 
            key={page}
            className="px-4 py-2 border rounded-md bg-indigo-600 text-white"
          >
            {page}
          </span>
        ) : (
          // 其他页
          <Link 
            key={page}
            href={`/${locale}${basePath}?page=${page}&pageSize=${pageSize}`}
            className="px-4 py-2 border rounded-md hover:bg-gray-50 transition"
          >
            {page}
          </Link>
        );
      })}
      
      {/* 下一页按钮 */}
      {currentPage < totalPages ? (
        <Link 
          href={`/${locale}${basePath}?page=${currentPage + 1}&pageSize=${pageSize}`}
          className="px-4 py-2 border rounded-md hover:bg-gray-50 transition"
        >
          {locale === 'en' ? 'Next' : '下一页'}
        </Link>
      ) : (
        <span className="px-4 py-2 border rounded-md text-gray-400 cursor-not-allowed">
          {locale === 'en' ? 'Next' : '下一页'}
        </span>
      )}
    </div>
  );
}

// 页面大小选择器
export function PageSizeSelector({ currentSize, locale, basePath, currentPage }: { 
  currentSize: number, 
  locale: string, 
  basePath: string,
  currentPage: number
}) {
  const sizes = [3, 5, 10];
  
  return (
    <div className="flex items-center justify-end mb-6">
      <span className="mr-2 text-gray-600">
        {locale === 'en' ? 'Items per page:' : '每页显示:'}
      </span>
      <div className="flex space-x-2">
        {sizes.map(size => (
          <Link 
            key={size}
            href={`/${locale}${basePath}?page=1&pageSize=${size}`}
            className={`px-3 py-1 border rounded-md transition ${
              currentSize === size 
                ? 'bg-indigo-600 text-white' 
                : 'hover:bg-gray-50'
            }`}
          >
            {size}
          </Link>
        ))}
      </div>
    </div>
  );
} 