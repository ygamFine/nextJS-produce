'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadSearchIndex, SearchItem } from '@/lib/search-indices';
import { useLocale } from '@/contexts/LocaleContext';

// 客户端搜索组件
export default function SearchClient({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const currentPage = Number(searchParams.get('page') || '1');
  const pageSize = Number(searchParams.get('pageSize') || '10');
  
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const { t } = useLocale();
  
  // 简单的翻译函数
  const translate = (key: string, defaultValue: string) => {
    return t ? t(key, defaultValue) : defaultValue;
  };
  
  // 加载搜索索引并执行搜索
  useEffect(() => {
    async function performSearch() {
      try {
        setIsLoading(true);
        setError(null);
        
        // 如果没有查询词，不执行搜索
        if (!query.trim()) {
          setSearchResults([]);
          setFilteredResults([]);
          setTotalResults(0);
          setIsLoading(false);
          return;
        }
        
        // 加载搜索索引
        const searchData = await loadSearchIndex(locale);
        console.log('搜索索引', searchData);
        
        // 多关键词搜索实现
        // 1. 分割查询词为多个关键词
        const keywords = query.toLowerCase().split(/\s+/).filter(k => k.length > 0);
        
        if (keywords.length === 0) {
          setSearchResults([]);
          setFilteredResults([]);
          setTotalResults(0);
          setIsLoading(false);
          return;
        }
        
        // 2. 为每个搜索项计算匹配分数
        const scoredResults = searchData.map(item => {
          const titleLower = (item.title || '').toLowerCase();
          const contentLower = (item.content || '').toLowerCase();
          
          let score = 0;
          let matchedKeywords = 0;
          
          // 计算每个关键词的匹配情况
          for (const keyword of keywords) {
            // 标题匹配得分更高
            if (titleLower.includes(keyword)) {
              score += 10;
              matchedKeywords++;
            }
            
            // 内容匹配
            if (contentLower.includes(keyword)) {
              score += 5;
              matchedKeywords++;
            }
          }
          
          // 如果所有关键词都匹配，额外加分
          if (matchedKeywords === keywords.length) {
            score += 20;
          }
          
          return {
            item,
            score,
            matchedKeywords
          };
        });
        
        // 3. 过滤掉没有匹配的项目，并按分数排序
        const results = scoredResults
          .filter(result => result.score > 0)
          .sort((a, b) => b.score - a.score)
          .map(result => result.item);
        
        console.log('最终的筛选结果', results);
        setSearchResults(results);
        setTotalResults(results.length);
        
        // 应用分页
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setFilteredResults(results.slice(startIndex, endIndex));
      } catch (err) {
        console.error('Search error:', err);
        setError(translate('search.error', '搜索时发生错误'));
      } finally {
        setIsLoading(false);
      }
    }
    
    performSearch();
  }, [query, locale, currentPage, pageSize, t]);
  
  // 高亮显示匹配的文本
  const highlightText = (text: string, keywords: string[]) => {
    if (!text || keywords.length === 0) return text;
    
    let result = text;
    const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
    result = result.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
    
    return result;
  };
  
  // 处理页码变化
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/${locale}/search?${params.toString()}`, { scroll: true });
  };
  
  // 处理每页显示数量变化
  const handlePageSizeChange = (size: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    params.set('pageSize', size.toString());
    router.push(`/${locale}/search?${params.toString()}`, { scroll: true });
  };
  
  // 计算总页数
  const totalPages = Math.ceil(totalResults / pageSize);
  
  // 生成分页按钮
  const renderPagination = () => {
    if (totalResults <= pageSize) return null;
    
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
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 border rounded-md hover:bg-gray-50 transition"
          >
            {locale === 'en' ? 'Previous' : '上一页'}
          </button>
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
            <button 
              key={page}
              onClick={() => handlePageChange(page)}
              className="px-4 py-2 border rounded-md hover:bg-gray-50 transition"
            >
              {page}
            </button>
          );
        })}
        
        {/* 下一页按钮 */}
        {currentPage < totalPages ? (
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 border rounded-md hover:bg-gray-50 transition"
          >
            {locale === 'en' ? 'Next' : '下一页'}
          </button>
        ) : (
          <span className="px-4 py-2 border rounded-md text-gray-400 cursor-not-allowed">
            {locale === 'en' ? 'Next' : '下一页'}
          </span>
        )}
      </div>
    );
  };
  
  // 页面大小选择器
  const renderPageSizeSelector = () => {
    const sizes = [5, 10, 20, 50];
    
    return (
      <div className="flex items-center justify-end mb-6">
        <span className="mr-2 text-gray-600">
          {locale === 'en' ? 'Items per page:' : '每页显示:'}
        </span>
        <div className="flex space-x-2">
          {sizes.map(size => (
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
    );
  };
  
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">
        {translate('search.results', '搜索结果')}
        {query && (
          <span className="text-gray-500 ml-2 font-normal">
            {translate('search.for', '关于')} "{query}"
          </span>
        )}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {query 
              ? translate('search.noResults', '未找到匹配的结果') 
              : translate('search.enterSearchTerm', '请输入搜索词')}
          </p>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500">
              {translate('search.found', '找到')} {totalResults} {translate('search.items', '个结果')}
              {totalPages > 1 && (
                <span className="ml-2">
                  {translate('search.showing', '显示')} {(currentPage - 1) * pageSize + 1}-
                  {Math.min(currentPage * pageSize, totalResults)} {translate('search.of', '共')} {totalResults}
                </span>
              )}
            </p>
            
            {totalPages > 1 && renderPageSizeSelector()}
          </div>
          
          <div className="space-y-6">
            {filteredResults.map((result) => (
              <Link 
                href={result.url || `/${locale}`} 
                key={result.id}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
              >
                <div className="flex">
                  {result.image && (
                    <div className="flex-shrink-0 mr-6">
                      <img 
                        src={result.image} 
                        alt={result.title || ''}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold text-indigo-600">
                      <span dangerouslySetInnerHTML={{ 
                        __html: highlightText(result.title || translate('search.untitled', '无标题'), query.toLowerCase().split(/\s+/)) 
                      }} />
                    </h2>
                    <div className="flex items-center mt-2">
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600">
                        {result.type === 'product' 
                          ? translate('search.product', '产品') 
                          : result.type === 'case'
                            ? translate('search.case', '案例')
                            : translate('search.news', '新闻')}
                      </span>
                      {result.date && (
                        <span className="ml-3 text-sm text-gray-500">
                          {new Date(result.date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-gray-600">
                      <span dangerouslySetInnerHTML={{ 
                        __html: highlightText((result.content || '').substring(0, 200), query.toLowerCase().split(/\s+/)) 
                      }} />
                      {(result.content || '').length > 200 ? '...' : ''}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* 分页控件 */}
          {renderPagination()}
        </div>
      )}
    </>
  );
} 