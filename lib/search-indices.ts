// 搜索项类型
export interface SearchItem {
  id: string;
  title: string;
  content: string;
  type: 'product' | 'news' | 'case';
  url: string;
  image?: string;
  date?: string;
  price?: number;
}

// 缓存搜索索引
const searchIndices: Record<string, SearchItem[]> = {};
const lastFetchTime: Record<string, number> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存

/**
 * 从 API 加载搜索索引
 * @param locale 语言代码
 * @returns 搜索索引
 */
export async function loadSearchIndex(locale: string): Promise<SearchItem[]> {
  try {
    const now = Date.now();
    
    // 如果缓存有效，使用缓存
    if (
      searchIndices[locale] && 
      lastFetchTime[locale] && 
      (now - lastFetchTime[locale]) < CACHE_TTL
    ) {
      return searchIndices[locale];
    }
    
    // 从 API 获取最新索引
    const response = await fetch(`/api/search-index?locale=${locale}`, {
      next: { revalidate: 60 } // 1分钟内不重复请求
    });
    
    if (!response.ok) {
      throw new Error(`Failed to load search index for ${locale}`);
    }
    
    const data = await response.json();
    
    // 更新缓存
    searchIndices[locale] = data;
    lastFetchTime[locale] = now;
    
    return data;
  } catch (error) {
    console.error(`Error loading search index for ${locale}:`, error);
    
    // 如果 API 请求失败但有缓存，使用缓存
    if (searchIndices[locale]) {
      return searchIndices[locale];
    }
    
    // 尝试从静态文件加载（作为后备）
    try {
      const response = await fetch(`/search/index-${locale}.json`);
      if (response.ok) {
        const data = await response.json();
        searchIndices[locale] = data;
        return data;
      }
    } catch (e) {
      console.error(`Error loading static search index for ${locale}:`, e);
    }
    
    return [];
  }
}

/**
 * 搜索函数
 * @param query 搜索查询
 * @param locale 语言代码
 * @returns 搜索结果
 */
export async function search(query: string, locale: string): Promise<SearchItem[]> {
  if (!query.trim()) return [];
  
  const index = await loadSearchIndex(locale);
  const lowerQuery = query.toLowerCase();
  
  return index.filter(item => 
    item.title.toLowerCase().includes(lowerQuery) || 
    item.content.toLowerCase().includes(lowerQuery)
  );
} 