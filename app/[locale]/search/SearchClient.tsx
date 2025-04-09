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
        
        // 多关键词搜索实现
        // 1. 分割查询词为多个关键词
        const keywords = query.toLowerCase().split(/\s+/).filter(k => k.length > 0);
        
        if (keywords.length === 0) {
          setSearchResults([]);
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
      } catch (err) {
        console.error('Search error:', err);
        setError(translate('search.error', '搜索时发生错误'));
      } finally {
        setIsLoading(false);
      }
    }
    
    performSearch();
  }, [query, locale, t]);
  
  // 高亮显示匹配的文本
  const highlightText = (text: string, keywords: string[]) => {
    if (!text || keywords.length === 0) return text;
    
    let result = text;
    const regex = new RegExp(`(${keywords.join('|')})`, 'gi');
    result = result.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
    
    return result;
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
        <div className="space-y-6">
          <p className="text-sm text-gray-500 mb-4">
            {translate('search.found', '找到')} {searchResults.length} {translate('search.items', '个结果')}
          </p>
          
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
      )}
    </>
  );
} 