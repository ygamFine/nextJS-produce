'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loadSearchIndex, SearchItem } from '@/lib/search-indices';
import { useLocale } from '@/contexts/LocaleContext';

// 客户端搜索组件
export default function SearchClient({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
          setIsLoading(false);
          return;
        }
        
        // 加载搜索索引
        const searchData = await loadSearchIndex(locale);
        console.log('搜索索引', searchData);
        // 简单的搜索实现 - 在标题和内容中查找关键词
        const keywords = query.toLowerCase().split(/\s+/).filter(k => k.length > 0);
        
        if (keywords.length === 0) {
          setSearchResults([]);
          setIsLoading(false);
          return;
        }
        
        // 执行搜索
        const results = searchData.filter(item => {
          const titleLower = (item.title || '').toLowerCase();
          const contentLower = (item.content || '').toLowerCase();
          
          // 检查所有关键词是否至少在标题或内容中出现一次
          return keywords.every(keyword => 
            titleLower.includes(keyword) || contentLower.includes(keyword)
          );
        });
        console.log('最终的筛选结果', results);
        setSearchResults(results);
      } catch (err) {
        console.error('Search error:', err);
        setError(translate('search.error', '搜索时出错，请稍后再试'));
      } finally {
        setIsLoading(false);
      }
    }
    
    performSearch();
  }, [query, locale]);
  
  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-center">
        {translate('search.title', '搜索结果')}
      </h1>
      
      <div className="mb-8">
        <p className="text-gray-600">
          {query ? (
            translate('search.resultsFor', '搜索结果：') + ` "${query}"`
          ) : (
            translate('search.enterQuery', '请输入搜索关键词')
          )}
        </p>
      </div>
      
      {error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      ) : isLoading ? (
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
        <div className="space-y-6">
          {searchResults.map((result) => (
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
                    {result.title || translate('search.untitled', '无标题')}
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
                    {(result.content || '').substring(0, 200)}
                    {(result.content || '').length > 200 ? '...' : ''}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
} 